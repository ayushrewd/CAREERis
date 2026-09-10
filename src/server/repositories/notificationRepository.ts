import { NotificationItem } from "@/types";
import { DEMO_NOTIFICATIONS } from "@/data/demoData";

let inMemoryNotifications: NotificationItem[] = DEMO_NOTIFICATIONS.map((n) => ({
  id: n.id,
  userId: n.userId || "user-cand-01",
  type: n.type || "SYSTEM",
  title: n.title,
  message: n.message,
  actionUrl: n.actionUrl || "",
  createdAt: n.createdAt,
  isRead: n.isRead,
}));

export const notificationRepository = {
  async findAll(params?: { userId?: string; role?: string }): Promise<NotificationItem[]> {
    let list = [...inMemoryNotifications];
    if (params?.userId) {
      list = list.filter((n) => !n.userId || n.userId === params.userId);
    }
    return list;
  },

  async create(data: Omit<NotificationItem, "id" | "createdAt" | "isRead">): Promise<NotificationItem> {
    const item: NotificationItem = {
      ...data,
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    inMemoryNotifications = [item, ...inMemoryNotifications];
    return item;
  },

  async markAsRead(id: string): Promise<boolean> {
    const notif = inMemoryNotifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  },

  async markAllAsRead(userId?: string): Promise<void> {
    inMemoryNotifications.forEach((n) => {
      if (!userId || !n.userId || n.userId === userId) {
        n.isRead = true;
      }
    });
  },
};
