import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    create: jest.fn(),
    findById: jest.fn(),
    updateRefreshToken: jest.fn(),
    findByIdWithRefreshToken: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: string) => {
              const map: Record<string, string> = {
                BCRYPT_ROUNDS: '12',
                JWT_ACCESS_SECRET: 'access-secret-min-32-characters-long',
                JWT_REFRESH_SECRET: 'refresh-secret-min-32-characters-long',
                JWT_ACCESS_EXPIRES_IN: '15m',
                JWT_REFRESH_EXPIRES_IN: '7d',
              };
              return map[key] ?? fallback;
            }),
            getOrThrow: jest.fn((key: string) => key),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('registers successfully', async () => {
    usersService.create.mockResolvedValue({
      _id: '1',
      email: 'a@b.com',
      role: 'user',
    });
    jwtService.signAsync
      .mockResolvedValueOnce('access')
      .mockResolvedValueOnce('refresh');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    usersService.findById.mockResolvedValue({
      _id: '1',
      email: 'a@b.com',
      role: 'user',
    });

    const result = await service.register({
      fullName: 'Test',
      email: 'a@b.com',
      phone: '+8801712345678',
      password: 'SecurePass1!',
      gender: 'male',
    });

    expect(result.accessToken).toBe('access');
    expect(result.refreshToken).toBe('refresh');
  });

  it('throws on duplicate registration', async () => {
    usersService.create.mockRejectedValue(new ConflictException());

    await expect(
      service.register({
        fullName: 'Test',
        email: 'a@b.com',
        phone: '+8801712345678',
        password: 'SecurePass1!',
        gender: 'male',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects invalid refresh token', async () => {
    usersService.findByIdWithRefreshToken.mockResolvedValue({
      refreshToken: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.refreshTokens('1', 'bad')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
