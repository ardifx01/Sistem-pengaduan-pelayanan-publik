import api from "./api";

export interface Notification {
  id: string;
  type: string;
  data: {
    complaint_id: number;
    registration_number: string;
    applicant_name: string;
    old_status?: string;
    new_status?: string;
    status?: string;
    service_name: string;
  };
  read_at: string | null;
  created_at: string;
}

export interface NotificationResponse {
  status: string;
  data: {
    data: Notification[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  status: string;
  data: {
    unread_count: number;
  };
}

export const notificationService = {
  // Get user notifications
  getNotifications: async (page: number = 1): Promise<NotificationResponse> => {
    const response = await api.get(`/notifications?page=${page}`);
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.put("/notifications/mark-all-read");
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
