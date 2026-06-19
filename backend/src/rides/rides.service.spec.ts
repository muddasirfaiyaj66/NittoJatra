import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RoutesService } from '../routes/routes.service';
import { LocationsService } from '../locations/locations.service';
import { OperatorsService } from '../operators/operators.service';
import { RidesService } from './rides.service';
import { Ride } from './schemas/ride.schema';
import { Review } from '../reviews/schemas/review.schema';

describe('RidesService', () => {
  let service: RidesService;

  const mockRouteId = '65f1a2b3c4d5e6f7a8b9c0d1';

  const mockRide = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d2',
    route: mockRouteId,
    operator: '65f1a2b3c4d5e6f7a8b9c0d3',
    departureTime: new Date('2026-06-09T07:00:00.000Z'),
    arrivalTime: new Date('2026-06-09T07:35:00.000Z'),
    serviceType: 'ac',
    totalSeats: 32,
    price: 25,
    seatMap: [
      { seatNumber: 'A1', row: 1, column: 1, status: 'available' },
      {
        seatNumber: 'A2',
        row: 1,
        column: 2,
        status: 'booked',
        bookedBy: 'user1',
      },
    ],
    status: 'scheduled',
    markModified: jest.fn(),
    save: jest.fn().mockResolvedValue(undefined),
    toObject: function () {
      return this;
    },
  };

  const rideModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const reviewModel = {
    find: jest.fn(),
  };

  const routesService = {
    findDocumentByLocationPair: jest.fn(),
    findDocumentById: jest.fn(),
    findOrCreateByLocationPair: jest.fn(),
  };

  const locationsService = {
    findOrCreateByName: jest.fn(),
  };

  const operatorsService = {
    findDocumentForServiceType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        {
          provide: getModelToken(Ride.name),
          useValue: rideModel,
        },
        {
          provide: getModelToken(Review.name),
          useValue: reviewModel,
        },
        {
          provide: RoutesService,
          useValue: routesService,
        },
        {
          provide: LocationsService,
          useValue: locationsService,
        },
        {
          provide: OperatorsService,
          useValue: operatorsService,
        },
      ],
    }).compile();

    service = module.get(RidesService);
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('returns rides when route exists', async () => {
      routesService.findDocumentByLocationPair.mockResolvedValue({
        _id: mockRouteId,
      });
      rideModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockRide]),
          }),
        }),
      });

      const result = await service.search({
        fromLocationId: 'from',
        toLocationId: 'to',
        date: '2026-06-09',
      });

      expect(result).toHaveLength(1);
    });

    it('returns empty array when route not found', async () => {
      routesService.findDocumentByLocationPair.mockResolvedValue(null);

      const result = await service.search({
        fromLocationId: 'from',
        toLocationId: 'to',
        date: '2026-06-09',
      });

      expect(result).toEqual([]);
    });
  });

  describe('holdSeat', () => {
    it('holds an available seat', async () => {
      rideModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRide,
          seatMap: [
            { seatNumber: 'A1', row: 1, column: 1, status: 'available' },
          ],
          markModified: jest.fn(),
          save: jest.fn().mockResolvedValue(undefined),
        }),
      });

      const result = await service.holdSeat(
        '65f1a2b3c4d5e6f7a8b9c0d2',
        'A1',
        'user2',
      );

      expect(result.status).toBe('booked');
      expect(result.bookedBy).toBe('user2');
    });

    it('throws when seat is already booked', async () => {
      rideModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRide),
      });

      await expect(
        service.holdSeat('65f1a2b3c4d5e6f7a8b9c0d2', 'A2', 'user2'),
      ).rejects.toThrow(ConflictException);
    });

    it('throws when ride not found', async () => {
      rideModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.holdSeat('invalid', 'A1', 'user2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
