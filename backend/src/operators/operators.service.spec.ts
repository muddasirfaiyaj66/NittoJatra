import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OperatorsService } from './operators.service';
import { Operator } from './schemas/operator.schema';

describe('OperatorsService', () => {
  let service: OperatorsService;

  const mockOperator = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'BRTC City Bus',
    code: 'BRTC',
    brandColor: '#4F46E5',
    rating: 4.2,
    totalRatings: 0,
    primaryType: 'ac',
    serviceTypes: ['ac'],
    isActive: true,
    toObject: function () {
      return this;
    },
  };

  const operatorModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperatorsService,
        {
          provide: getModelToken(Operator.name),
          useValue: operatorModel,
        },
      ],
    }).compile();

    service = module.get(OperatorsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns active operators', async () => {
      operatorModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockOperator]),
        }),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('BRTC');
    });
  });

  describe('findById', () => {
    it('returns operator when found', async () => {
      operatorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOperator),
      });

      const result = await service.findById('65f1a2b3c4d5e6f7a8b9c0d1');

      expect(result.code).toBe('BRTC');
    });

    it('throws when operator not found', async () => {
      operatorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
