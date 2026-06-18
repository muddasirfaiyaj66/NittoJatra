import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LocationsService } from './locations.service';
import { Location } from './schemas/location.schema';

describe('LocationsService', () => {
  let service: LocationsService;

  const mockLocation = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'মিরপুর',
    nameEn: 'Mirpur',
    zone: 'North Dhaka',
    coordinates: { type: 'Point', coordinates: [90.3563, 23.8041] },
    isActive: true,
    sortOrder: 0,
    toObject: function () {
      return this;
    },
  };

  const locationModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getModelToken(Location.name),
          useValue: locationModel,
        },
      ],
    }).compile();

    service = module.get(LocationsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns active locations sorted by zone and sortOrder', async () => {
      locationModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockLocation]),
        }),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].nameEn).toBe('Mirpur');
      expect(locationModel.find).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('search', () => {
    it('searches by name or nameEn case-insensitively', async () => {
      locationModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockLocation]),
        }),
      });

      const result = await service.search('mirpur');

      expect(result).toHaveLength(1);
      expect(locationModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
          $or: expect.any(Array),
        }),
      );
    });

    it('returns all locations when query is empty', async () => {
      locationModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockLocation]),
        }),
      });

      const result = await service.search('');

      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('throws when location not found', async () => {
      locationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
