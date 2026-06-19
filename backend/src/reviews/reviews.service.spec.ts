import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { Booking } from '../bookings/schemas/booking.schema';
import { Operator } from '../operators/schemas/operator.schema';
import { User } from '../users/schemas/user.schema';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockBooking = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a5',
    bookingId: 'NJ-20260609-A1B2',
    user: { _id: '65f1a2b3c4d5e6f7a8b9c0a1' },
    status: 'completed',
    ride: {
      _id: '65f1a2b3c4d5e6f7a8b9c0a4',
      driverUserId: '65f1a2b3c4d5e6f7a8b9c0a2',
      operator: { _id: '65f1a2b3c4d5e6f7a8b9c0a3' },
    },
  };

  const mockReview = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a6',
    booking: '65f1a2b3c4d5e6f7a8b9c0a5',
    rider: '65f1a2b3c4d5e6f7a8b9c0a1',
    driver: '65f1a2b3c4d5e6f7a8b9c0a2',
    operator: '65f1a2b3c4d5e6f7a8b9c0a3',
    rating: 5,
    comment: 'Great journey!',
    createdAt: new Date(),
    toObject: function () {
      return this;
    },
  };

  const mockOperator = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a3',
    rating: 4.0,
    totalRatings: 10,
    save: jest.fn().mockResolvedValue(true),
  };

  const mockDriver = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a2',
    rating: 4.5,
    totalRatings: 8,
    save: jest.fn().mockResolvedValue(true),
  };

  const reviewModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    create: jest.fn(),
  };

  const bookingModel = {
    findOne: jest.fn(),
  };

  const operatorModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockOperator),
    }),
  };

  const userModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDriver),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: reviewModel,
        },
        {
          provide: getModelToken(Booking.name),
          useValue: bookingModel,
        },
        {
          provide: getModelToken(Operator.name),
          useValue: operatorModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('creates a review and updates operator & driver ratings on happy path', async () => {
      bookingModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBooking),
        }),
      });
      reviewModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      reviewModel.create.mockResolvedValue(mockReview);

      const result = await service.createReview('65f1a2b3c4d5e6f7a8b9c0a1', 'NJ-20260609-A1B2', {
        rating: 5,
        comment: 'Great journey!',
      });

      expect(result.rating).toBe(5);
      expect(result.comment).toBe('Great journey!');
      expect(reviewModel.create).toHaveBeenCalled();
      
      // Verification of math:
      // Operator new rating = ((4.0 * 10) + 5) / 11 = 4.1
      expect(mockOperator.rating).toBe(4.1);
      expect(mockOperator.totalRatings).toBe(11);
      expect(mockOperator.save).toHaveBeenCalled();

      // Driver new rating = ((4.5 * 8) + 5) / 9 = 4.6
      expect(mockDriver.rating).toBe(4.6);
      expect(mockDriver.totalRatings).toBe(9);
      expect(mockDriver.save).toHaveBeenCalled();
    });

    it('throws NotFoundException when booking does not exist', async () => {
      bookingModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(
        service.createReview('65f1a2b3c4d5e6f7a8b9c0a1', 'NJ-20260609-A1B2', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException if booking does not belong to user', async () => {
      bookingModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBooking),
        }),
      });

      await expect(
        service.createReview('65f1a2b3c4d5e6f7a8b9c0f9', 'NJ-20260609-A1B2', { rating: 5 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException if booking status is pending', async () => {
      const pendingBooking = { ...mockBooking, status: 'pending' };
      bookingModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(pendingBooking),
        }),
      });

      await expect(
        service.createReview('65f1a2b3c4d5e6f7a8b9c0a1', 'NJ-20260609-A1B2', { rating: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException if review already exists', async () => {
      bookingModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBooking),
        }),
      });
      reviewModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReview),
      });

      await expect(
        service.createReview('65f1a2b3c4d5e6f7a8b9c0a1', 'NJ-20260609-A1B2', { rating: 5 }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
