import { storageService } from '../storage.service';
import { AppConfig } from 'src/config/AppConfig';

// API 基礎配置
export const API_CONFIG = {
  BASE_URL: 'https://staging.cofit.me',
  TIMEOUT: 30000,

  // 如果不同 app 需要不同的 base URL，可以這樣設計：
  // BASE_URL: AppConfig.APP_TYPE === 'spa'
  //   ? 'https://staging-spa.cofit.me'
  //   : 'https://staging-bb.cofit.me',
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
