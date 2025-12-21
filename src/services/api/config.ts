import { storageService } from '../storage.service';
import { AppConfig } from 'src/config/AppConfig';
import { store } from 'src/store';
import { logout } from 'src/store/slices/authSlice';

// API 基礎配置
export const API_CONFIG = {
  BASE_URL: 'https://ff-staging.cofit.me',
  CLIENT_BASE_URL: 'https://ff-staging.cofit.me', // 客戶端 API（手機登入）
  TIMEOUT: 30000,

  // TODO 拆分 staging / production 環境
  // BASE_URL staging https://ff-staging.cofit.me
  // BASE_URL production https://ff.cofit.me
  // Client API staging: https://ff-staging.cofit.me
  // Client API production: https://pro.cofit.me
} as const;

// HTTP 請求工具
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await storageService.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getHeaders();
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // 處理 401 未授權錯誤
      if (response.status === 401) {
        console.error('收到 401 未授權錯誤，自動登出用戶');

        // 執行登出
        store.dispatch(logout());

        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || '登入已過期，請重新登入');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(endpoint + queryString, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
