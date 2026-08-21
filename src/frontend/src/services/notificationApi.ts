import api from './api';

// ============================================================
// Student notifications (UC-14)
// ============================================================

export interface NotificationItem {
  notificationId: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  list: async (): Promise<NotificationItem[]> => {
    return api.get<NotificationItem[]>('/api/notifications');
  },

  unreadCount: async (): Promise<number> => {
    const res = await api.get<{ unread: number }>('/api/notifications/unread-count');
    return res.unread;
  },

  markRead: async (id: number): Promise<void> => {
    await api.post<void>(`/api/notifications/${id}/read`);
  },
};
