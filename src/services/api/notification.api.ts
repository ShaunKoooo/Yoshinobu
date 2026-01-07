import { apiClient } from './config';
import {
    GetNotificationsRequest,
    GetNotificationsResponse,
    SetNotificationsReadRequest,
    SetNotificationsReadResponse,
    Notification
} from './types';

export const notificationApi = {
    /**
     * 取得通知列表
     */
    getNotifications: async (params: GetNotificationsRequest): Promise<Notification[]> => {
        // API 回傳的是陣列，不是包在 object 裡
        return apiClient.get<Notification[]>('/v4/notifications', params);
    },

    /**
     * 標記通知為已讀
     */
    setRead: async (ids: number[]): Promise<SetNotificationsReadResponse> => {
        return apiClient.post<SetNotificationsReadResponse>('/v4/notifications/set_read', { ids });
    },
};
