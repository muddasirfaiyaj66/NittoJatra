import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ComplaintDocument = HydratedDocument<Complaint>;

@Schema({ timestamps: true, collection: 'complaints' })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  byUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  againstUser: Types.ObjectId;

  @Prop({ required: true, enum: ['rider', 'driver'] })
  byRole: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({
    required: true,
    enum: ['pending', 'investigating', 'resolved'],
    default: 'pending',
  })
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
