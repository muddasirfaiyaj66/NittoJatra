import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { paginate } from '../common/helpers/pagination.helper';
import { RidesService } from '../rides/rides.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  toConversationResponse,
  toMessageResponse,
} from './messages.mapper';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';

const BOOKING_POPULATE = [
  {
    path: 'ride',
    populate: [
      {
        path: 'route',
        populate: [
          { path: 'fromLocation', select: 'nameEn' },
          { path: 'toLocation', select: 'nameEn' },
        ],
      },
      { path: 'operator', select: 'name' },
    ],
  },
];

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly ridesService: RidesService,
  ) {}

  async syncForUser(userId: string) {
    const bookings = await this.bookingModel
      .find({
        user: userId,
        status: { $in: ['pending', 'confirmed', 'completed'] },
      })
      .populate(BOOKING_POPULATE)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    for (const booking of bookings) {
      await this.ensureForBooking(booking);
    }
  }

  async ensureForBooking(booking: BookingDocument | Record<string, unknown>) {
    const bookingDoc = booking as BookingDocument & {
      _id: Types.ObjectId;
      bookingId: string;
      user: Types.ObjectId;
      ride?: {
        route?: {
          fromLocation?: { nameEn: string };
          toLocation?: { nameEn: string };
        };
        operator?: { name: string };
      };
      status?: string;
    };

    const existing = await this.conversationModel
      .findOne({ booking: bookingDoc._id })
      .exec();
    if (existing) {
      return existing;
    }

    const from = bookingDoc.ride?.route?.fromLocation?.nameEn ?? 'Pickup';
    const to = bookingDoc.ride?.route?.toLocation?.nameEn ?? 'Drop-off';
    const operatorName = bookingDoc.ride?.operator?.name ?? 'Operator';
    const welcome =
      bookingDoc.status === 'confirmed'
        ? `Your booking ${from} → ${to} is confirmed. Captain will contact you before departure.`
        : `Booking ${bookingDoc.bookingId} received. Complete payment to confirm your seat.`;

    const conversation = await this.conversationModel.create({
      user: bookingDoc.user,
      booking: bookingDoc._id,
      bookingRef: bookingDoc.bookingId,
      title: `${from} → ${to}`,
      participantName: operatorName,
      lastMessage: welcome,
      lastMessageAt: new Date(),
      unreadForUser: 1,
      unreadForOperator: 0,
    });

    await this.messageModel.create({
      conversation: conversation._id,
      sender: bookingDoc.user,
      senderRole: 'system',
      body: welcome,
      readByRider: false,
      readByOperator: true,
    });

    this.logger.log(`Conversation created for booking ${bookingDoc.bookingId}`);
    return conversation;
  }

  async listForUser(userId: string, role: string) {
    if (role === 'operator' || role === 'admin') {
      return this.listForOperator();
    }

    await this.syncForUser(userId);
    const conversations = await this.conversationModel
      .find({ user: userId })
      .sort({ lastMessageAt: -1 })
      .exec();

    return conversations.map((item) => toConversationResponse(item, 'user'));
  }

  async listForOperator() {
    const rideIds = await this.ridesService.findScheduledRideIds();
    if (rideIds.length === 0) {
      return [];
    }

    const bookings = await this.bookingModel
      .find({
        ride: { $in: rideIds },
        status: { $in: ['pending', 'confirmed', 'completed'] },
      })
      .populate(BOOKING_POPULATE)
      .exec();

    for (const booking of bookings) {
      await this.ensureForBooking(booking);
    }

    const bookingObjectIds = bookings.map((booking) => booking._id);
    const conversations = await this.conversationModel
      .find({ booking: { $in: bookingObjectIds } })
      .sort({ lastMessageAt: -1 })
      .exec();

    return conversations.map((item) =>
      toConversationResponse(item, 'operator'),
    );
  }

  async getMessages(
    conversationId: string,
    userId: string,
    role: string,
    page = 1,
    limit = 50,
  ) {
    const conversation = await this.getAccessibleConversation(
      conversationId,
      userId,
      role,
    );

    const total = await this.messageModel
      .countDocuments({ conversation: conversation._id })
      .exec();
    const messages = await this.messageModel
      .find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    await this.markRead(conversation, role);

    return paginate(messages.map(toMessageResponse), total, page, limit);
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    role: string,
    dto: CreateMessageDto,
  ) {
    const conversation = await this.getAccessibleConversation(
      conversationId,
      userId,
      role,
    );

    const senderRole =
      role === 'operator' || role === 'admin' ? 'operator' : 'rider';

    const message = await this.messageModel.create({
      conversation: conversation._id,
      sender: userId,
      senderRole,
      body: dto.body.trim(),
      readByRider: senderRole === 'rider',
      readByOperator: senderRole === 'operator',
    });

    conversation.lastMessage = dto.body.trim();
    conversation.lastMessageAt = new Date();
    if (senderRole === 'rider') {
      conversation.unreadForOperator += 1;
    } else {
      conversation.unreadForUser += 1;
    }
    await conversation.save();

    return toMessageResponse(message);
  }

  async ensureFromBookingRef(
    bookingRef: string,
    userId: string,
    role: string,
  ) {
    const booking = await this.bookingModel
      .findOne({ bookingId: bookingRef })
      .populate(BOOKING_POPULATE)
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (role !== 'operator' && role !== 'admin' && String(booking.user) !== userId) {
      throw new ForbiddenException('You do not have access to this booking chat');
    }

    const conversation = await this.ensureForBooking(booking);
    return toConversationResponse(
      conversation,
      role === 'operator' || role === 'admin' ? 'operator' : 'user',
    );
  }

  private async getAccessibleConversation(
    conversationId: string,
    userId: string,
    role: string,
  ) {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (role === 'operator' || role === 'admin') {
      const rideIds = await this.ridesService.findTodayIds();
      const booking = await this.bookingModel
        .findById(conversation.booking)
        .select('ride user')
        .exec();
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      const rideId = String(booking.ride);
      if (!rideIds.includes(rideId) && role !== 'admin') {
        throw new ForbiddenException('You do not have access to this chat');
      }
      return conversation;
    }

    if (String(conversation.user) !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return conversation;
  }

  private async markRead(conversation: ConversationDocument, role: string) {
    if (role === 'operator' || role === 'admin') {
      conversation.unreadForOperator = 0;
      await this.messageModel.updateMany(
        { conversation: conversation._id, readByOperator: false },
        { $set: { readByOperator: true } },
      );
    } else {
      conversation.unreadForUser = 0;
      await this.messageModel.updateMany(
        { conversation: conversation._id, readByRider: false },
        { $set: { readByRider: true } },
      );
    }
    await conversation.save();
  }
}
