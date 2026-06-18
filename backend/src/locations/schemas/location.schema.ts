import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ timestamps: true, collection: 'locations' })
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nameEn: string;

  @Prop({ required: true })
  zone: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  coordinates: { type: string; coordinates: [number, number] };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
LocationSchema.index({ coordinates: '2dsphere' });
