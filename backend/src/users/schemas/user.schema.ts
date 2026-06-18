import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['male', 'female', 'other'], required: true })
  gender: string;

  @Prop({ enum: ['user', 'admin', 'operator'], default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  totalTrips: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop({ trim: true })
  vehicleModel?: string;

  @Prop({ trim: true })
  vehiclePlate?: string;

  @Prop({ trim: true })
  vehicleType?: string;

  @Prop({ select: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
