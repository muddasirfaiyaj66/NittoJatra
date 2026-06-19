import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BookingListQueryDto } from './dto/booking-list-query.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';
import { ReviewsService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Seat not available' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.userId, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'List bookings for rides departing today (captain dashboard)',
  })
  @ApiResponse({ status: 200, description: 'Paginated booking list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findDashboard(@Query() query: BookingListQueryDto) {
    return this.bookingsService.findDashboard(query);
  }

  @Get()
  @ApiOperation({ summary: 'List current user bookings' })
  @ApiResponse({ status: 200, description: 'Paginated booking list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUserBookings(
    @CurrentUser() user: { userId: string },
    @Query() query: BookingListQueryDto,
  ) {
    return this.bookingsService.findUserBookings(user.userId, query);
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking detail' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findById(
    @CurrentUser() user: { userId: string; role: string },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingsService.findById(bookingId, user.userId, user.role);
  }

  @Patch(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid booking status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  cancel(
    @CurrentUser() user: { userId: string; role: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(bookingId, user.userId, dto, user.role);
  }

  @Patch(':bookingId/confirm-payment')
  @ApiOperation({ summary: 'Confirm payment (mock flow)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  confirmPayment(
    @CurrentUser() user: { userId: string; role: string },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingsService.confirmPayment(
      bookingId,
      user.userId,
      user.role,
    );
  }

  @Post(':bookingId/review')
  @ApiOperation({ summary: 'Submit a review for a booking' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking status or request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 409, description: 'Already reviewed' })
  createReview(
    @CurrentUser() user: { userId: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.userId, bookingId, dto);
  }
}
