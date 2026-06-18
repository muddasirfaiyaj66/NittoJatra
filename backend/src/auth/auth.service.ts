import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.bcryptRounds = Number(this.configService.get('BCRYPT_ROUNDS', 12));
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.create(dto);
      return this.buildAuthResponse(user._id, user.email, user.role);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Registration failed', error);
      throw error;
    }
  }

  async login(user: {
    userId: string;
    email: string;
    role: string;
  }): Promise<AuthResponseDto> {
    return this.buildAuthResponse(user.userId, user.email, user.role);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
    this.logger.log(`User logged out: ${userId}`);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.buildAuthResponse(user._id.toString(), user.email, user.role);
  }

  private async buildAuthResponse(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(userId, email, role);
    const hashedRefresh = await this.hashToken(tokens.refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefresh);
    const user = await this.usersService.findById(userId);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.bcryptRounds);
  }
}
