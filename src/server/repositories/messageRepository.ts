import { MessageRecord, INITIAL_MESSAGES } from "@/lib/store/platformStore";

let inMemoryMessages: MessageRecord[] = [...INITIAL_MESSAGES];

export interface ConversationSummary {
  conversationId: string;
  recipientId: string;
  recipientName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export const messageRepository = {
  async getMessages(conversationId: string): Promise<MessageRecord[]> {
    return inMemoryMessages.filter((m) => m.conversationId === conversationId);
  },

  async sendMessage(data: Omit<MessageRecord, "id" | "sentAt" | "isRead">): Promise<MessageRecord> {
    const msg: MessageRecord = {
      ...data,
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    inMemoryMessages.push(msg);
    return msg;
  },

  async getConversations(userId: string): Promise<ConversationSummary[]> {
    const map = new Map<string, ConversationSummary>();

    inMemoryMessages.forEach((m) => {
      const isSender = m.senderId === userId;
      const otherId = isSender ? m.recipientId : m.senderId;
      const otherName = isSender ? m.recipientName : m.senderName;

      map.set(m.conversationId, {
        conversationId: m.conversationId,
        recipientId: otherId,
        recipientName: otherName,
        lastMessage: m.content,
        lastTimestamp: m.sentAt,
        unreadCount: 0,
      });
    });

    return Array.from(map.values());
  },
};
