import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { ConversationDocument } from './schemas/conversation.schema';
import { MessageDocument } from './schemas/message.schema';

export function toConversationResponse(
  conversation: ConversationDocument | Record<string, unknown>,
  viewerRole: 'user' | 'operator' | 'admin' = 'user',
) {
  const obj =
    typeof (conversation as ConversationDocument).toObject === 'function'
      ? (conversation as ConversationDocument).toObject()
      : conversation;

  const dto = plainToInstance(ConversationResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  assignDocumentId(dto, obj as { _id?: { toString(): string } | string });

  const unreadForUser = Number(
    (obj as { unreadForUser?: number }).unreadForUser ?? 0,
  );
  const unreadForOperator = Number(
    (obj as { unreadForOperator?: number }).unreadForOperator ?? 0,
  );

  dto.unreadCount =
    viewerRole === 'operator' || viewerRole === 'admin'
      ? unreadForOperator
      : unreadForUser;
  dto.online = true;

  return dto;
}

export function toMessageResponse(
  message: MessageDocument | Record<string, unknown>,
) {
  const obj =
    typeof (message as MessageDocument).toObject === 'function'
      ? (message as MessageDocument).toObject()
      : message;
  const dto = plainToInstance(MessageResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  return assignDocumentId(
    dto,
    obj as { _id?: { toString(): string } | string },
  );
}
