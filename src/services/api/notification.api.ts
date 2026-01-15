import { apiClient } from './config';
import { COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
import {
    GetNotificationsRequest,
    GetNotificationsResponse,
    SetNotificationsReadRequest,
    SetNotificationsReadResponse,
    Notification,
    UnreadCountResponse
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

    /**
     * 取得未讀數量
     * 根據用戶角色調用不同的端點
     */
    getUnreadCount: async (): Promise<UnreadCountResponse> => {
        // 從 storage 獲取用戶角色
        const userRole = await storageService.getUserRole();

        // 根據角色使用不同的端點
        const endpoint = userRole === 'client'
            ? CLIENT_ENDPOINTS.UNREAD_COUNT
            : COACH_ENDPOINTS.UNREAD_COUNT;

        return apiClient.get<UnreadCountResponse>(endpoint);
    },
};
