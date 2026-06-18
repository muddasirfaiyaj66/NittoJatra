import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { toUserResponse } from './users.mapper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly bcryptRounds: number;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    configService: ConfigService,
  ) {
    this.bcryptRounds = Number(configService.get('BCRYPT_ROUNDS', 12));
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({
      $or: [{ email: dto.email.toLowerCase() }, { phone: dto.phone }],
    });
    if (existing) {
      throw new ConflictException('Email or phone already registered');
    }

    const password = await bcrypt.hash(dto.password, this.bcryptRounds);
    const user = await this.userModel.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password,
    });

    this.logger.log(`User created: ${user.email}`);
    return toUserResponse(user);
  }

  async findByEmail(email: string, includePassword = false) {
    const query = this.userModel
      .findOne({ email: email.toLowerCase() })
      .select(includePassword ? '+password +refreshToken' : '');
    return query.exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserResponse(user);
  }

  async findDocumentById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByIdWithRefreshToken(id: string) {
    return this.userModel.findById(id).select('+refreshToken').exec();
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserResponse(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(id).select('+password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(dto.currentPassword, user.password);
    if (!matches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(dto.newPassword, this.bcryptRounds);
    await user.save();
    this.logger.log(`Password changed for user ${user.email}`);
    return { message: 'Password updated successfully' };
  }

  async updateRefreshToken(id: string, hashedToken: string | null) {
    await this.userModel.findByIdAndUpdate(id, { refreshToken: hashedToken });
  }

  async deactivate(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Account deactivated successfully' };
  }

  async incrementTripStats(id: string, amount: number) {
    await this.userModel.findByIdAndUpdate(id, {
      $inc: { totalTrips: 1, totalSpent: amount },
    });
  }

  async decrementTripStats(id: string, amount: number) {
    await this.userModel.findByIdAndUpdate(id, {
      $inc: { totalTrips: -1, totalSpent: -amount },
    });
  }
}
