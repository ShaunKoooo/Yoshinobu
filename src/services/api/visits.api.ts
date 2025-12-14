import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
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
    const response = await apiClient.get<GetVisitsResponse>(
      API_ENDPOINTS.VISITS,
      params
    );
    return response.visits || response as any;
  },

  /**
   * 取消預約
   * @param id - 預約 ID
   */
  cancelVisit: async (id: number): Promise<CancelVisitResponse> => {
    return await apiClient.post<CancelVisitResponse>(
      API_ENDPOINTS.CANCEL_VISIT(id)
    );
  },
};
