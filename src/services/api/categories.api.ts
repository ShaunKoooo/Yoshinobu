import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Category,
  GetCategoriesResponse,
} from './types';

/**
 * 類別管理 API
 */
export const categoriesApi = {
  /**
   * 取得所有類別
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<GetCategoriesResponse>(API_ENDPOINTS.CATEGORIES);
    return response.categories || response as any;
  },
};
