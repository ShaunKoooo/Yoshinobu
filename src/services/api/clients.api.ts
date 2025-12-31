import { apiClient } from './config';
import { API_ENDPOINTS, COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
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
   * Client 角色使用 CLIENT_DETAIL 端點，Coach 角色使用 COACH CLIENT_DETAIL 端點
   */
  getClient: async (id: number): Promise<Client> => {
    const userRole = await storageService.getUserRole();

    if (userRole === 'client') {
      // Client 角色使用 client 端點
      return await apiClient.get<Client>(CLIENT_ENDPOINTS.CLIENT_DETAIL(id));
    }

    // Coach 角色使用 coach 端點
    return await apiClient.get<Client>(COACH_ENDPOINTS.CLIENT_DETAIL(id));
  },

  /**
   * 建立新客戶
   */
  createClient: async (data: CreateClientRequest): Promise<Client> => {
    return await apiClient.post<Client>(API_ENDPOINTS.CLIENTS, data);
  },

  /**
   * 更新客戶資料
   * Client 角色使用 CLIENT_DETAIL 端點，Coach 角色使用 COACH CLIENT_DETAIL 端點
   */
  updateClient: async (id: number, data: UpdateClientRequest): Promise<Client> => {
    const userRole = await storageService.getUserRole();

    if (userRole === 'client') {
      // Client 角色使用 client 端點更新資料
      return await apiClient.put<Client>(CLIENT_ENDPOINTS.CLIENT_DETAIL(id), data);
    }

    // Coach 角色使用 coach 端點
    return await apiClient.put<Client>(COACH_ENDPOINTS.CLIENT_DETAIL(id), data);
  },
};
