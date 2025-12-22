import { apiClient } from './config';
import { COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
import type {
  ContractVisit,
  GetContractVisitsRequest,
  GetContractVisitsResponse,
  SubmitContractVisitForVerificationResponse,
  CompleteContractVisitResponse,
} from './types';

/**
 * 合約預約管理 API
 */
export const contractVisitsApi = {
  /**
   * 取得合約預約列表
   * @param params - 查詢參數 (status)
   */
  getContractVisits: async (params?: GetContractVisitsRequest): Promise<ContractVisit[]> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.CONTRACT_VISITS
      : COACH_ENDPOINTS.CONTRACT_VISITS;

    console.log('getContractVisits - userRole:', userRole, 'endpoint:', endpoint);

    const response = await apiClient.get<GetContractVisitsResponse>(
      endpoint,
      params
    );
    return response.contract_visits || response as any;
  },

  /**
   * 會員提交預約待核銷 (User/Coach only)
   * @param id - 合約預約 ID
   */
  submitForVerification: async (id: number): Promise<SubmitContractVisitForVerificationResponse> => {
    const userRole = await storageService.getUserRole();

    if (userRole !== 'coach') {
      throw new Error('Only coaches can submit visits for verification');
    }

    const endpoint = COACH_ENDPOINTS.SUBMIT_CONTRACT_VISIT_FOR_VERIFICATION(id);
    console.log('submitForVerification - endpoint:', endpoint);

    return await apiClient.post<SubmitContractVisitForVerificationResponse>(endpoint);
  },

  /**
   * 客戶確認完成預約 (Client only)
   * @param id - 合約預約 ID
   */
  completeVisit: async (id: number): Promise<CompleteContractVisitResponse> => {
    const userRole = await storageService.getUserRole();

    if (userRole !== 'client') {
      throw new Error('Only clients can complete visits');
    }

    const endpoint = CLIENT_ENDPOINTS.COMPLETE_CONTRACT_VISIT(id);
    console.log('completeVisit - endpoint:', endpoint);

    return await apiClient.post<CompleteContractVisitResponse>(endpoint);
  },
};
