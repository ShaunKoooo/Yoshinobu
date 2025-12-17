import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  ShareContract,
  CreateShareContractRequest,
  CreateShareContractResponse,
} from './types';

/**
 * 共用合約管理 API
 */
export const shareContractsApi = {
  /**
   * 建立共用合約
   */
  createShareContract: async (data: CreateShareContractRequest): Promise<ShareContract> => {
    const response = await apiClient.post<CreateShareContractResponse>(
      API_ENDPOINTS.SHARE_CONTRACTS,
      data
    );
    return response.share_contract || response as any;
  },
};
