import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: Record<string, unknown> = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    fullName: 'Ahmed Rahman',
    email: 'ahmed@nittojatra.com',
    phone: '+8801712345678',
    password: 'hashed',
    gender: 'male',
    role: 'user',
    isActive: true,
    totalTrips: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    save: jest.fn(),
  };
  mockUser.toObject = () => ({ ...mockUser });
  (mockUser.save as jest.Mock).mockResolvedValue(mockUser);

  const userModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(12) },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a user on happy path', async () => {
      userModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      userModel.create.mockResolvedValue(mockUser);

      const result = await service.create({
        fullName: 'Ahmed Rahman',
        email: 'ahmed@nittojatra.com',
        phone: '+8801712345678',
        password: 'SecurePass1!',
        gender: 'male',
      });

      expect(result.email).toBe('ahmed@nittojatra.com');
      expect(userModel.create).toHaveBeenCalled();
    });

    it('throws on duplicate email', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          fullName: 'Ahmed Rahman',
          email: 'ahmed@nittojatra.com',
          phone: '+8801712345678',
          password: 'SecurePass1!',
          gender: 'male',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('changePassword', () => {
    it('throws when current password is wrong', async () => {
      userModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('65f1a2b3c4d5e6f7a8b9c0d1', {
          currentPassword: 'wrong',
          newPassword: 'NewPass456!',
          confirmNewPassword: 'NewPass456!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
