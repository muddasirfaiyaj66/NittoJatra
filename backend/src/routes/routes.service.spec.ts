import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RoutesService } from './routes.service';
import { Route } from './schemas/route.schema';

describe('RoutesService', () => {
  let service: RoutesService;

  const mockRoute = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    fromLocation: { nameEn: 'Mirpur' },
    toLocation: { nameEn: 'Motijheel' },
    distanceKm: 12,
    estimatedMinutes: 35,
    basePrice: 25,
    isActive: true,
    popularityScore: 0,
    toObject: function () {
      return this;
    },
  };

  const routeModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: getModelToken(Route.name),
          useValue: routeModel,
        },
      ],
    }).compile();

    service = module.get(RoutesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns active routes sorted by popularity', async () => {
      routeModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockRoute]),
          }),
        }),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(routeModel.find).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('findByLocationPair', () => {
    it('returns route for location pair', async () => {
      routeModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoute),
        }),
      });

      const result = await service.findByLocationPair(
        '65f1a2b3c4d5e6f7a8b9c0d1',
        '65f1a2b3c4d5e6f7a8b9c0d2',
      );

      expect(result).toBeDefined();
    });

    it('throws when route not found', async () => {
      routeModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(
        service.findByLocationPair(
          '65f1a2b3c4d5e6f7a8b9c0d1',
          '65f1a2b3c4d5e6f7a8b9c0d2',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
