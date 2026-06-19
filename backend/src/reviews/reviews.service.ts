import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Operator, OperatorDocument } from '../operators/schemas/operator.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';
import { toReviewResponse } from './reviews.mapper';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Operator.name) private readonly operatorModel: Model<OperatorDocument>,
  ) {}

  async createReview(userId: string, bookingId: string, dto: CreateReviewDto) {
    const booking = await this.bookingModel
      .findOne({ bookingId })
      .populate('ride')
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (String(booking.user._id ?? booking.user) !== userId) {
      throw new ForbiddenException(
        'You are not authorized to review this booking',
      );
    }

    if (booking.status === 'pending') {
      throw new BadRequestException(
        'You cannot review a pending (unpaid) booking',
      );
    }

    const existingReview = await this.reviewModel
      .findOne({ booking: booking._id })
      .exec();

    if (existingReview) {
      throw new ConflictException('You have already reviewed this booking');
    }

    const ride = booking.ride as any;
    if (!ride) {
      throw new NotFoundException('Ride associated with booking not found');
    }

    // Create the review
    const review = await this.reviewModel.create({
      booking: booking._id,
      rider: new Types.ObjectId(userId),
      driver: ride.driverUserId || undefined,
      operator: ride.operator._id ?? ride.operator,
      rating: dto.rating,
      comment: dto.comment,
    });

    // Update Operator ratings
    const operatorId = ride.operator._id ?? ride.operator;
    const operator = await this.operatorModel.findById(operatorId).exec();
    if (operator) {
      const newTotal = (operator.totalRatings || 0) + 1;
      const oldRating = operator.rating !== undefined ? operator.rating : 4.0;
      const newRating =
        (oldRating * (operator.totalRatings || 0) + dto.rating) / newTotal;
      operator.totalRatings = newTotal;
      operator.rating = parseFloat(newRating.toFixed(1));
      await operator.save();
    }

    // Update Driver ratings (if ride has a driverUserId)
    if (ride.driverUserId) {
      const driver = await this.userModel.findById(ride.driverUserId).exec();
      if (driver) {
        const newTotal = (driver.totalRatings || 0) + 1;
        const oldRating = driver.rating !== undefined ? driver.rating : 5.0;
        const newRating =
          (oldRating * (driver.totalRatings || 0) + dto.rating) / newTotal;
        driver.totalRatings = newTotal;
        driver.rating = parseFloat(newRating.toFixed(1));
        await driver.save();
      }
    }

    this.logger.log(`Review created for booking: ${bookingId}`);
    return toReviewResponse(review);
  }
}
