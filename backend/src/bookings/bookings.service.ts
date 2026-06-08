import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoutesService } from '../routes/routes.service';
import { RidesService } from '../rides/rides.service';
import { UsersService } from '../users/users.service';
import { BookingListQueryDto } from './dto/booking-list-query.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { generateBookingId } from './helpers/booking-id.helper';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { toBookingResponse } from './bookings.mapper';
import { paginate } from '../common/helpers/pagination.helper';

const POPULATE_OPTIONS = [
  {
    path: 'ride',
    populate: [
      {
        path: 'route',
        populate: [
          { path: 'fromLocation', select: 'name nameEn zone' },
          { path: 'toLocation', select: 'name nameEn zone' },
        ],
      },
      { path: 'operator', select: 'name code brandColor rating primaryType' },
    ],
  },
  { path: 'user', select: 'fullName phone' },
];

const PROMO_NITTO10 = 'NITTO10';
const CONVENIENCE_FEE = 5;
const MAX_PROMO_DISCOUNT = 50;

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly ridesService: RidesService,
    private readonly usersService: UsersService,
    private readonly routesService: RoutesService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const ride = await this.ridesService.findDocumentById(dto.rideId);

    for (const seatNumber of dto.seats) {
      const seat = ride.seatMap.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        throw new NotFoundException(`Seat ${seatNumber} not found`);
      }
      if (seat.status === 'booked' || seat.status === 'blocked') {
        throw new ConflictException(`Seat ${seatNumber} is not available`);
      }
    }

    const baseFare = ride.price * dto.seats.length;
    let discount = 0;

    if (dto.promoCode?.toUpperCase() === PROMO_NITTO10) {
      discount = Math.min(Math.round(baseFare * 0.1), MAX_PROMO_DISCOUNT);
    }

    const totalAmount = baseFare + CONVENIENCE_FEE - discount;

    for (const seatNumber of dto.seats) {
      await this.ridesService.holdSeat(dto.rideId, seatNumber, userId);
    }

    const booking = await this.bookingModel.create({
      bookingId: generateBookingId(),
      user: userId,
      ride: dto.rideId,
      seats: dto.seats,
      passengerName: dto.passengerName,
      passengerPhone: dto.passengerPhone,
      passengerEmail: dto.passengerEmail.toLowerCase(),
      passengerNid: dto.passengerNid,
      baseFare,
      convenienceFee: CONVENIENCE_FEE,
      discount,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: dto.paymentMethod,
      promoCode: dto.promoCode?.toUpperCase(),
    });

    await this.usersService.incrementTripStats(userId, totalAmount);
    await this.routesService.incrementPopularity(String(ride.route));

    const populated = await booking.populate(POPULATE_OPTIONS);
    this.logger.log(`Booking created: ${booking.bookingId}`);
    return toBookingResponse(populated);
  }

  async findUserBookings(userId: string, query: BookingListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = { user: userId };

    if (query.status) {
      filter.status = query.status;
    }

    const total = await this.bookingModel.countDocuments(filter).exec();
    const bookings = await this.bookingModel
      .find(filter)
      .populate(POPULATE_OPTIONS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return paginate(bookings.map(toBookingResponse), total, page, limit);
  }

  async findById(bookingId: string, userId: string, role = 'user') {
    const booking = await this.bookingModel
      .findOne({ bookingId })
      .populate(POPULATE_OPTIONS)
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      role !== 'admin' &&
      String(booking.user._id ?? booking.user) !== userId
    ) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return toBookingResponse(booking);
  }

  async cancel(
    bookingId: string,
    userId: string,
    dto: CancelBookingDto,
    role = 'user',
  ) {
    const booking = await this.bookingModel.findOne({ bookingId }).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (role !== 'admin' && String(booking.user) !== userId) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new BadRequestException(
        `Cannot cancel booking with status "${booking.status}"`,
      );
    }

    for (const seatNumber of booking.seats) {
      await this.ridesService.releaseSeat(String(booking.ride), seatNumber);
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date();
    booking.cancellationReason = dto.cancellationReason;
    await booking.save();

    await this.usersService.decrementTripStats(userId, booking.totalAmount);

    const populated = await booking.populate(POPULATE_OPTIONS);
    this.logger.log(`Booking cancelled: ${bookingId}`);
    return toBookingResponse(populated);
  }

  async confirmPayment(bookingId: string, userId: string, role = 'user') {
    const booking = await this.bookingModel.findOne({ bookingId }).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (role !== 'admin' && String(booking.user) !== userId) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException(
        'Cannot confirm payment for a cancelled booking',
      );
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    const populated = await booking.populate(POPULATE_OPTIONS);
    this.logger.log(`Payment confirmed: ${bookingId}`);
    return toBookingResponse(populated);
  }
}
