import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Booking } from '../bookings/schemas/booking.schema';
import { User } from '../users/schemas/user.schema';
import { Operator } from '../operators/schemas/operator.schema';
import { ComplaintsService } from './complaints.service';
import { Complaint } from './schemas/complaint.schema';

describe('ComplaintsService', () => {
  let service: ComplaintsService;

  const mockRiderId = '65f1a2b3c4d5e6f7a8b9c0a1';
  const mockDriverId = '65f1a2b3c4d5e6f7a8b9c0a2';
  const mockOtherId = '65f1a2b3c4d5e6f7a8b9c0a3';

  const mockBooking = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a5',
    bookingId: 'NJ-20260609-A1B2',
    user: { _id: mockRiderId },
    ride: {
      _id: '65f1a2b3c4d5e6f7a8b9c0a4',
      driverUserId: mockDriverId,
      operator: '65f1a2b3c4d5e6f7a8b9c0a9',
    },
  };

  const mockComplaint = {
    _id: '65f1a2b3c4d5e6f7a8b9c0a6',
    booking: '65f1a2b3c4d5e6f7a8b9c0a5',
    byUser: mockRiderId,
    againstUser: mockDriverId,
    byRole: 'rider',
    category: 'behavior',
    description: 'The driver behaved rudely.',
    status: 'pending',
    toObject: function () {
      return this;
    },
  };

  const complaintModel = {
    create: jest.fn().mockResolvedValue(mockComplaint),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockComplaint]),
      }),
    }),
  };

  const bookingModel = {
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    }),
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    }),
  };

  const userModel = {
    findById: jest.fn(),
  };

  const operatorModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        {
          provide: getModelToken(Complaint.name),
          useValue: complaintModel,
        },
        {
          provide: getModelToken(Booking.name),
          useValue: bookingModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: getModelToken(Operator.name),
          useValue: operatorModel,
        },
      ],
    }).compile();

    service = module.get(ComplaintsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates complaint successfully for rider complaining about driver', async () => {
      bookingModel.findById().populate().exec.mockResolvedValue(mockBooking);
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: mockDriverId }),
      });
      complaintModel.create.mockResolvedValue(mockComplaint);

      const result = await service.create(mockRiderId, {
        bookingId: '65f1a2b3c4d5e6f7a8b9c0a5',
        againstUserId: mockDriverId,
        byRole: 'rider',
        category: 'behavior',
        description: 'The driver behaved rudely.',
      });

      expect(result).toBeDefined();
      expect(result.category).toBe('behavior');
      expect(complaintModel.create).toHaveBeenCalled();
    });

    it('creates complaint successfully for rider complaining about operator when driver is not assigned', async () => {
      const mockOperatorId = '65f1a2b3c4d5e6f7a8b9c0a9';
      const bookingWithoutDriver = {
        ...mockBooking,
        ride: {
          ...mockBooking.ride,
          driverUserId: undefined,
          operator: mockOperatorId,
        },
      };

      bookingModel.findById().populate().exec.mockResolvedValue(bookingWithoutDriver);
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      operatorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: mockOperatorId }),
      });

      const operatorComplaint = {
        ...mockComplaint,
        againstUser: mockOperatorId,
      };
      complaintModel.create.mockResolvedValue(operatorComplaint);

      const result = await service.create(mockRiderId, {
        bookingId: '65f1a2b3c4d5e6f7a8b9c0a5',
        againstUserId: mockOperatorId,
        byRole: 'rider',
        category: 'cleanliness',
        description: 'The vehicle was dirty.',
      });

      expect(result).toBeDefined();
      expect(result.againstUser).toBe(mockOperatorId);
      expect(operatorModel.findById).toHaveBeenCalledWith(mockOperatorId);
    });

    it('creates complaint successfully for driver complaining about rider', async () => {
      bookingModel.findById().populate().exec.mockResolvedValue(mockBooking);
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: mockRiderId }),
      });
      
      const driverComplaint = {
        ...mockComplaint,
        byUser: mockDriverId,
        againstUser: mockRiderId,
        byRole: 'driver',
      };
      complaintModel.create.mockResolvedValue(driverComplaint);

      const result = await service.create(mockDriverId, {
        bookingId: '65f1a2b3c4d5e6f7a8b9c0a5',
        againstUserId: mockRiderId,
        byRole: 'driver',
        category: 'behavior',
        description: 'The rider damaged seat layout.',
      });

      expect(result).toBeDefined();
      expect(result.byRole).toBe('driver');
    });

    it('throws NotFoundException if booking does not exist', async () => {
      bookingModel.findById().populate().exec.mockResolvedValue(null);
      bookingModel.findOne().populate().exec.mockResolvedValue(null);

      await expect(
        service.create(mockRiderId, {
          bookingId: 'invalid-id',
          againstUserId: mockDriverId,
          byRole: 'rider',
          category: 'behavior',
          description: 'No booking exists.',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException if rider complains on another user booking', async () => {
      bookingModel.findById().populate().exec.mockResolvedValue(mockBooking);
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: mockDriverId }),
      });

      await expect(
        service.create(mockOtherId, {
          bookingId: '65f1a2b3c4d5e6f7a8b9c0a5',
          againstUserId: mockDriverId,
          byRole: 'rider',
          category: 'behavior',
          description: 'Not my booking.',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException if rider complains against an unrelated user', async () => {
      bookingModel.findById().populate().exec.mockResolvedValue(mockBooking);
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: mockOtherId }),
      });

      await expect(
        service.create(mockRiderId, {
          bookingId: '65f1a2b3c4d5e6f7a8b9c0a5',
          againstUserId: mockOtherId,
          byRole: 'rider',
          category: 'behavior',
          description: 'Rider complains against random person.',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
