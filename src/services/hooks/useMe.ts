import { useQuery } from '@tanstack/react-query';
import { meApi } from '../api';

/**
 * Query Keys for Me
 */
export const meKeys = {
  all: ['me'] as const,
  details: () => [...meKeys.all, 'detail'] as const,
};

/**
 * 取得使用者資訊
 */
export const useMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: meKeys.details(),
    queryFn: () => meApi.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled, // 只有在 enabled 為 true 時才會執行 query
  });
};