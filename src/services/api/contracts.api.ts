import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Contract,
  CreateContractRequest,
  CreateContractResponse,
} from './types';

/**
 * 合約管理 API
 */
export const contractsApi = {
  /**
   * 建立新合約
   */
  createContract: async (data: CreateContractRequest): Promise<Contract> => {
    const response = await apiClient.post<CreateContractResponse>(
      API_ENDPOINTS.CONTRACTS,
      data
    );
    return response.contract || response as any;
  },
};
