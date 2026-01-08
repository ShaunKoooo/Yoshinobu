import { apiClient } from './config';
import { API_ENDPOINTS, COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
import type {
  Contract,
  GetContractsRequest,
  GetContractsResponse,
  CreateContractRequest,
  CreateContractResponse,
  GetAvailableContractRequest,
  GetAvailableContractResponse,
  FindContractsByMobileRequest,
  FindContractsByMobileResponse,
  GetMediaUploadInfoRequest,
  GetMediaUploadInfoResponse,
} from './types';

/**
 * 合約管理 API
 */
export const contractsApi = {
  /**
   * 取得客戶的合約列表
   * Client 角色使用 CLIENT CONTRACTS 端點，Coach 角色使用 COACH CONTRACTS 端點
   * @param params - 包含 client_id 的參數
   */
  getContracts: async (params: GetContractsRequest): Promise<GetContractsResponse> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.CONTRACTS
      : COACH_ENDPOINTS.CONTRACTS;

    console.log('getContracts - userRole:', userRole, 'endpoint:', endpoint, 'params:', params);

    return await apiClient.get<GetContractsResponse>(
      endpoint,
      params
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

  /**
   * 取得可用的合約
   * 根據 service_id 和 consumed_time 找出最舊且剩餘時間足夠的合約
   * @param params - 查詢參數 (service_id, consumed_time, client_id)
   */
  getAvailableContract: async (params: GetAvailableContractRequest): Promise<Contract | null> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.AVAILABLE_CONTRACT
      : COACH_ENDPOINTS.AVAILABLE_CONTRACT;

    console.log('getAvailableContract - userRole:', userRole, 'endpoint:', endpoint, 'params:', params);

    const response = await apiClient.get<GetAvailableContractResponse>(
      endpoint,
      params
    );
    return response.contract || null;
  },

  /**
   * 根據手機號碼查詢客戶及其合約
   * @param params - 包含 mobile 的參數
   */
  findContractsByMobile: async (params: FindContractsByMobileRequest): Promise<FindContractsByMobileResponse> => {
    // 從 storage 獲取用戶角色
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.FIND_CONTRACTS_BY_MOBILE
      : COACH_ENDPOINTS.FIND_CONTRACTS_BY_MOBILE;

    console.log('findContractsByMobile - userRole:', userRole, 'endpoint:', endpoint, 'params:', params);

    return await apiClient.get<FindContractsByMobileResponse>(
      endpoint,
      params
    );
  },

  /**
   * 取得媒體上傳憑證
   */
  getMediaUploadInfo: async (params: GetMediaUploadInfoRequest): Promise<GetMediaUploadInfoResponse> => {
    return await apiClient.get<GetMediaUploadInfoResponse>(
      '/v4/notes/media_upload_info',
      params
    );
  },
};
