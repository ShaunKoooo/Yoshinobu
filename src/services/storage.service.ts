import AsyncStorage from '@react-native-async-storage/async-storage';

// 集中管理常用的 Storage Keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  USER_ROLE: 'userRole',
  LAST_SELECTED_SERVICE_ID: 'lastSelectedServiceId',
  LAST_SELECTED_PROVIDER_ID: 'lastSelectedProviderId',
  // 可以在這裡添加更多常用的 keys
} as const;

// Types
export interface UserData {
  account?: string;
  phone?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  nick_name?: string;
  avatar_thumbnail_url?: string | null;
  hasura_token?: string;
  [key: string]: any;
}

// Storage Service
class StorageService {
  // ==================== Auth 相關（常用，提供便捷方法） ====================

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to set auth token:', error);
      throw error;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
      throw error;
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to set user data:', error);
      throw error;
    }
  }

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to remove user data:', error);
      throw error;
    }
  }

  async getUserRole(): Promise<'coach' | 'client' | null> {
    try {
      const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
      return role as 'coach' | 'client' | null;
    } catch (error) {
      console.error('Failed to get user role:', error);
      return null;
    }
  }

  async setUserRole(role: 'coach' | 'client'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    } catch (error) {
      console.error('Failed to set user role:', error);
      throw error;
    }
  }

  async removeUserRole(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    } catch (error) {
      console.error('Failed to remove user role:', error);
      throw error;
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_ROLE,
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }

  // ==================== Booking 相關 ====================

  async getLastSelectedServiceId(): Promise<number | null> {
    try {
      const id = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTED_SERVICE_ID);
      return id ? Number(id) : null;
    } catch (error) {
      console.error('Failed to get last selected service id:', error);
      return null;
    }
  }

  async setLastSelectedServiceId(serviceId: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SELECTED_SERVICE_ID, String(serviceId));
    } catch (error) {
      console.error('Failed to set last selected service id:', error);
      throw error;
    }
  }

  async getLastSelectedProviderId(): Promise<number | null> {
    try {
      const id = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTED_PROVIDER_ID);
      return id ? Number(id) : null;
    } catch (error) {
      console.error('Failed to get last selected provider id:', error);
      return null;
    }
  }

  async setLastSelectedProviderId(providerId: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SELECTED_PROVIDER_ID, String(providerId));
    } catch (error) {
      console.error('Failed to set last selected provider id:', error);
      throw error;
    }
  }

  // ==================== 通用方法（其他用途，靈活使用） ====================

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  // JSON 資料的便捷方法
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get JSON ${key}:`, error);
      return null;
    }
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set JSON ${key}:`, error);
      throw error;
    }
  }

  // 清除所有資料（謹慎使用！）
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export keys for reference
export { STORAGE_KEYS };