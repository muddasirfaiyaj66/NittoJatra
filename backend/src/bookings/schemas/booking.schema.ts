import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({ required: true, unique: true })
  bookingId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ride', required: true })
  ride: Types.ObjectId;

  @Prop({ type: [String], required: true })
  seats: string[];

  @Prop({ required: true })
  passengerName: string;

  @Prop({ required: true })
  passengerPhone: string;

  @Prop({ required: true })
  passengerEmail: string;

  @Prop()
  passengerNid?: string;

  @Prop({ required: true })
  baseFare: number;

  @Prop({ default: 5 })
  convenienceFee: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({
    enum: ['bkash', 'nagad', 'rocket', 'card', 'cash'],
    required: true,
  })
  paymentMethod: string;

  @Prop({ enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' })
  paymentStatus: string;

  @Prop()
  promoCode?: string;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancellationReason?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
