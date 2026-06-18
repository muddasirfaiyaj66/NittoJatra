import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

@Schema({ timestamps: true, collection: 'routes' })
export class Route {
  @Prop({ type: Types.ObjectId, ref: 'Location', required: true })
  fromLocation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Location', required: true })
  toLocation: Types.ObjectId;

  @Prop({ required: true })
  distanceKm: number;

  @Prop({ required: true })
  estimatedMinutes: number;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  popularityScore: number;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
