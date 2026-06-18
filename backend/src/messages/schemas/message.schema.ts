import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ enum: ['rider', 'operator', 'system'], required: true })
  senderRole: string;

  @Prop({ required: true, maxlength: 2000 })
  body: string;

  @Prop({ default: false })
  readByRider: boolean;

  @Prop({ default: false })
  readByOperator: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
