import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Contract,
  GetContractsRequest,
  GetContractsResponse,
  CreateContractRequest,
  CreateContractResponse,
} from './types';

/**
 * 合約管理 API
 */
export const contractsApi = {
  /**
   * 取得客戶的合約列表
   * @param params - 包含 client_id 的參數
   */
  getContracts: async (params: GetContractsRequest): Promise<GetContractsResponse> => {
    return await apiClient.get<GetContractsResponse>(
      API_ENDPOINTS.CONTRACTS,
      { params }
    );
  },

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
