import { apiClient } from './config';
import { COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
import type {
  Visit,
  GetVisitsRequest,
  GetVisitsResponse,
  CancelVisitResponse,
} from './types';

/**
 * 預約管理 API
 */
export const visitsApi = {
  /**
   * 取得預約列表
   * @param params - 查詢參數 (date, state, client_id, provider_id)
   */
  getVisits: async (params?: GetVisitsRequest): Promise<Visit[]> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.VISITS
      : COACH_ENDPOINTS.VISITS;

    console.log('📱 getVisits - userRole:', userRole, 'endpoint:', endpoint);

    const response = await apiClient.get<any>(
      endpoint,
      params
    );
    // 支援 visits 和 contract_visits 兩種回應格式
    return response.visits || response.contract_visits || response as any;
  },

  /**
   * 取消預約
   * @param id - 預約 ID
   */
  cancelVisit: async (id: number): Promise<CancelVisitResponse> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.CANCEL_VISIT(id)
      : COACH_ENDPOINTS.CANCEL_VISIT(id);

    console.log('📱 cancelVisit - userRole:', userRole, 'endpoint:', endpoint);

    return await apiClient.post<CancelVisitResponse>(endpoint);
  },
};
