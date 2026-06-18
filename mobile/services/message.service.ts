import { apiClient } from '@/services/api.client';
import {
  ApiConversation,
  ApiMessage,
  ApiPaginatedMessages,
} from '@/services/api.types';
import { ChatMessage, MessageThread, UserRole } from '@/types';

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function mapConversation(conversation: ApiConversation): MessageThread {
  return {
    id: conversation._id,
    bookingRef: conversation.bookingRef,
    name: conversation.participantName,
    initial: conversation.participantName.trim().charAt(0).toUpperCase() || '?',
    lastMessage: conversation.lastMessage,
    time: formatMessageTime(conversation.lastMessageAt),
    unread: conversation.unreadCount,
    online: conversation.online,
  };
}

function isMessageMine(senderRole: string, viewerRole: UserRole): boolean {
  if (senderRole === 'system') return false;
  if (viewerRole === 'driver') return senderRole === 'operator';
  return senderRole === 'rider';
}

function mapMessage(message: ApiMessage, viewerRole: UserRole): ChatMessage {
  return {
    id: message._id,
    body: message.body,
    senderRole: message.senderRole as ChatMessage['senderRole'],
    createdAt: message.createdAt ?? new Date().toISOString(),
    isMine: isMessageMine(message.senderRole, viewerRole),
  };
}

export const messageService = {
  async listConversations(): Promise<MessageThread[]> {
    const conversations = await apiClient.get<ApiConversation[]>(
      '/messages/conversations',
      undefined,
      true,
    );
    return conversations.map(mapConversation);
  },

  async ensureFromBooking(bookingRef: string): Promise<MessageThread> {
    const conversation = await apiClient.get<ApiConversation>(
      `/messages/conversations/booking/${encodeURIComponent(bookingRef)}`,
      undefined,
      true,
    );
    return mapConversation(conversation);
  },

  async getMessages(
    conversationId: string,
    viewerRole: UserRole,
    page = 1,
  ): Promise<ChatMessage[]> {
    const result = await apiClient.get<ApiPaginatedMessages>(
      `/messages/conversations/${conversationId}`,
      { page, limit: 50 },
      true,
    );
    return result.data.map((message) => mapMessage(message, viewerRole));
  },

  async sendMessage(
    conversationId: string,
    body: string,
    viewerRole: UserRole,
  ): Promise<ChatMessage> {
    const message = await apiClient.post<ApiMessage>(
      `/messages/conversations/${conversationId}`,
      { body },
      true,
    );
    return mapMessage(message, viewerRole);
  },
};
