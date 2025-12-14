import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  GetClientsResponse,
} from './types';

/**
 * 客戶管理 API
 */
export const clientsApi = {
  /**
   * 取得客戶列表
   */
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get<GetClientsResponse>(API_ENDPOINTS.CLIENTS);
    return response.clients || response as any;
  },

  /**
   * 取得單一客戶詳情
   */
  getClient: async (id: number): Promise<Client> => {
    return await apiClient.get<Client>(API_ENDPOINTS.CLIENT_DETAIL(id));
  },

  /**
   * 建立新客戶
   */
  createClient: async (data: CreateClientRequest): Promise<Client> => {
    return await apiClient.post<Client>(API_ENDPOINTS.CLIENTS, data);
  },

  /**
   * 更新客戶資料
   */
  updateClient: async (id: number, data: UpdateClientRequest): Promise<Client> => {
    return await apiClient.put<Client>(API_ENDPOINTS.CLIENT_DETAIL(id), data);
  },
};
