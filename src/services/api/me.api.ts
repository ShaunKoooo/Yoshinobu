import { apiClient } from './config';
import { COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
import type {
  Client,
  UpdateDeviceRequest,
  UpdateDeviceResponse,
} from './types';

/**
 * 用戶資料 API
 */
export const meApi = {
  /**
   * 取得使用者資料
   * 根據用戶角色調用不同的端點
   */
  getMe: async (): Promise<any> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();

    console.log('📱 getMe - userRole from storage:', userRole, 'type:', typeof userRole);

    // 根據角色使用不同的端點
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.CLIENT_ME
      : COACH_ENDPOINTS.USER_ME;

    console.log('📱 getMe - 選擇的 endpoint:', endpoint, 'userRole === "client":', userRole === 'client');

    const response = await apiClient.get<any>(endpoint);
    return response || ({} as any);
  },

  /**
   * 更新設備資訊 (FCM Token)
   */
  updateDevice: async (data: UpdateDeviceRequest): Promise<UpdateDeviceResponse> => {
    const userRole = await storageService.getUserRole();

    // 根據角色使用不同的端點
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.UPDATE_DEVICE
      : COACH_ENDPOINTS.UPDATE_DEVICE;

    return await apiClient.post<UpdateDeviceResponse>(endpoint, data);
  },
};