import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OperatorDocument = HydratedDocument<Operator>;

@Schema({ timestamps: true, collection: 'operators' })
export class Operator {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  logoUrl?: string;

  @Prop({ required: true, default: '#4F46E5' })
  brandColor: string;

  @Prop({ required: true, default: 4.0, min: 1, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({
    enum: ['ac', 'non-ac', 'women-special', 'express', 'mixed'],
    required: true,
  })
  primaryType: string;

  @Prop({
    type: [String],
    enum: ['ac', 'non-ac', 'women-special', 'express'],
  })
  serviceTypes: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
