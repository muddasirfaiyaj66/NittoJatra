import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true, unique: true })
  booking: Types.ObjectId;

  @Prop({ required: true })
  bookingRef: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  participantName: string;

  @Prop({ default: '' })
  lastMessage: string;

  @Prop({ default: () => new Date() })
  lastMessageAt: Date;

  @Prop({ default: 0 })
  unreadForUser: number;

  @Prop({ default: 0 })
  unreadForOperator: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
