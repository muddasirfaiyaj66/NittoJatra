import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SeatDto } from '../dto/seat.dto';

export type RideDocument = HydratedDocument<Ride>;

@Schema({ timestamps: true, collection: 'rides' })
export class Ride {
  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  route: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Operator', required: true })
  operator: Types.ObjectId;

  @Prop({ required: true })
  departureTime: Date;

  @Prop({ required: true })
  arrivalTime: Date;

  @Prop({
    required: true,
    enum: ['ac', 'non-ac', 'women-special', 'express'],
  })
  serviceType: string;

  @Prop({ required: true, default: 32 })
  totalSeats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [Object] })
  seatMap: SeatDto[];

  @Prop({
    enum: ['scheduled', 'boarding', 'departed', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
