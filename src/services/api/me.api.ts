import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Client,
} from './types';

/**
 * 客戶管理 API
 */
export const meApi = {
  /**
   * 取得使用者資料
   */
  getMe: async (): Promise<any> => {
    const response = await apiClient.get<any>(API_ENDPOINTS.USER_ME);
    return response || ({} as any);
  },
};