import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RoutesService } from '../routes/routes.service';
import { RidesService } from '../rides/rides.service';
import { UsersService } from '../users/users.service';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';

jest.mock('./helpers/booking-id.helper', () => ({
  generateBookingId: jest.fn().mockReturnValue('NJ-20260609-TEST'),
}));

describe('BookingsService', () => {
  let service: BookingsService;

  const userId = '65f1a2b3c4d5e6f7a8b9c0d1';
  const rideId = '65f1a2b3c4d5e6f7a8b9c0d2';

  const mockRide = {
    _id: rideId,
    route: '65f1a2b3c4d5e6f7a8b9c0d3',
    price: 25,
    seatMap: [
      { seatNumber: 'A1', row: 1, column: 1, status: 'available' },
      { seatNumber: 'A2', row: 1, column: 2, status: 'booked' },
    ],
  };

  const mockBooking = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d4',
    bookingId: 'NJ-20260609-TEST',
    user: userId,
    ride: rideId,
    seats: ['A1'],
    passengerName: 'Ahmed Rahman',
    passengerPhone: '+8801712345678',
    passengerEmail: 'ahmed@nittojatra.com',
    baseFare: 25,
    convenienceFee: 5,
    discount: 0,
    totalAmount: 30,
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'bkash',
    populate: jest.fn().mockResolvedValue({
      bookingId: 'NJ-20260609-TEST',
      user: { fullName: 'Ahmed Rahman', phone: '+8801712345678' },
      toObject: function () {
        return this;
      },
    }),
    save: jest.fn().mockResolvedValue(undefined),
    toObject: function () {
      return this;
    },
  };

  const bookingModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  const ridesService = {
    findDocumentById: jest.fn(),
    holdSeat: jest.fn(),
    releaseSeat: jest.fn(),
  };

  const usersService = {
    incrementTripStats: jest.fn(),
    decrementTripStats: jest.fn(),
  };

  const routesService = {
    incrementPopularity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getModelToken(Booking.name), useValue: bookingModel },
        { provide: RidesService, useValue: ridesService },
        { provide: UsersService, useValue: usersService },
        { provide: RoutesService, useValue: routesService },
      ],
    }).compile();

    service = module.get(BookingsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates booking on happy path', async () => {
      ridesService.findDocumentById.mockResolvedValue(mockRide);
      ridesService.holdSeat.mockResolvedValue({});
      bookingModel.create.mockResolvedValue(mockBooking);

      const result = await service.create(userId, {
        rideId,
        seats: ['A1'],
        passengerName: 'Ahmed Rahman',
        passengerPhone: '+8801712345678',
        passengerEmail: 'ahmed@nittojatra.com',
        paymentMethod: 'bkash',
      });

      expect(result).toBeDefined();
      expect(ridesService.holdSeat).toHaveBeenCalledWith(rideId, 'A1', userId);
      expect(usersService.incrementTripStats).toHaveBeenCalled();
    });

    it('throws when seat is not available', async () => {
      ridesService.findDocumentById.mockResolvedValue(mockRide);

      await expect(
        service.create(userId, {
          rideId,
          seats: ['A2'],
          passengerName: 'Ahmed Rahman',
          passengerPhone: '+8801712345678',
          passengerEmail: 'ahmed@nittojatra.com',
          paymentMethod: 'bkash',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('applies NITTO10 promo discount', async () => {
      ridesService.findDocumentById.mockResolvedValue(mockRide);
      ridesService.holdSeat.mockResolvedValue({});
      bookingModel.create.mockImplementation((data) =>
        Promise.resolve({ ...mockBooking, ...data }),
      );

      await service.create(userId, {
        rideId,
        seats: ['A1'],
        passengerName: 'Ahmed Rahman',
        passengerPhone: '+8801712345678',
        passengerEmail: 'ahmed@nittojatra.com',
        paymentMethod: 'bkash',
        promoCode: 'NITTO10',
      });

      expect(bookingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          discount: 3,
          totalAmount: 27,
          promoCode: 'NITTO10',
        }),
      );
    });
  });

  describe('cancel', () => {
    it('cancels booking for owner', async () => {
      bookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockBooking,
          status: 'pending',
        }),
      });

      await service.cancel('NJ-20260609-TEST', userId, {});

      expect(ridesService.releaseSeat).toHaveBeenCalled();
      expect(usersService.decrementTripStats).toHaveBeenCalled();
    });

    it('throws for wrong owner', async () => {
      bookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockBooking,
          user: 'other-user-id',
        }),
      });

      await expect(
        service.cancel('NJ-20260609-TEST', userId, {}),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws when booking already cancelled', async () => {
      bookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockBooking,
          status: 'cancelled',
        }),
      });

      await expect(
        service.cancel('NJ-20260609-TEST', userId, {}),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
