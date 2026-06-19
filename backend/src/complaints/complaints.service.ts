import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Operator, OperatorDocument } from '../operators/schemas/operator.schema';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint, ComplaintDocument } from './schemas/complaint.schema';
import { toComplaintResponse } from './complaints.mapper';

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  constructor(
    @InjectModel(Complaint.name)
    private readonly complaintModel: Model<ComplaintDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Operator.name)
    private readonly operatorModel: Model<OperatorDocument>,
  ) {}

  async create(userId: string, dto: CreateComplaintDto) {
    // 1. Resolve the Booking
    let booking = await this.bookingModel
      .findById(dto.bookingId)
      .populate('ride')
      .exec();

    if (!booking) {
      booking = await this.bookingModel
        .findOne({ bookingId: dto.bookingId })
        .populate('ride')
        .exec();
    }

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 2. Validate user or operator exists
    const againstUser = await this.userModel.findById(dto.againstUserId).exec();
    let againstOperator = null;
    if (!againstUser) {
      againstOperator = await this.operatorModel.findById(dto.againstUserId).exec();
    }
    if (!againstUser && !againstOperator) {
      throw new NotFoundException('User being complained against not found');
    }

    const ride = booking.ride as any;

    // 3. Authorization Checks
    if (dto.byRole === 'rider') {
      if (String(booking.user._id ?? booking.user) !== userId) {
        throw new ForbiddenException(
          'You are not authorized to file a complaint for this booking',
        );
      }
      // Complain against driver/operator
      const rideDriverId = ride?.driverUserId ? String(ride.driverUserId) : null;
      const rideOperatorId = ride?.operator ? String(ride.operator) : null;
      if (
        String(dto.againstUserId) !== rideDriverId &&
        String(dto.againstUserId) !== rideOperatorId
      ) {
        throw new BadRequestException(
          'Riders can only file complaints against the driver or operator of the ride',
        );
      }
    } else if (dto.byRole === 'driver') {
      const rideDriverId = ride?.driverUserId ? String(ride.driverUserId) : null;
      if (rideDriverId !== userId) {
        throw new ForbiddenException(
          'You are not the driver assigned to this booking',
        );
      }
      // Complain against rider
      if (String(booking.user._id ?? booking.user) !== String(dto.againstUserId)) {
        throw new BadRequestException(
          'Drivers can only file complaints against the passenger of the booking',
        );
      }
    } else {
      throw new BadRequestException('Invalid complainant role');
    }

    // 4. Create Complaint
    const complaint = await this.complaintModel.create({
      booking: booking._id,
      byUser: userId,
      againstUser: dto.againstUserId,
      byRole: dto.byRole,
      category: dto.category,
      description: dto.description,
      status: 'pending',
    });

    this.logger.log(
      `Complaint ${complaint._id} registered by user ${userId} against ${dto.againstUserId}`,
    );

    return toComplaintResponse(complaint);
  }

  async findByUser(userId: string) {
    const complaints = await this.complaintModel
      .find({
        $or: [{ byUser: userId }, { againstUser: userId }],
      })
      .sort({ createdAt: -1 })
      .exec();

    return complaints.map(toComplaintResponse);
  }
}
