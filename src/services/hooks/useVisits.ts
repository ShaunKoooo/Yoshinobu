import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitsApi } from '../api';
import type { GetVisitsRequest } from '../api/types';

/**
 * React Query hooks for Visit Management
 */

// Query Keys
export const visitKeys = {
  all: ['visits'] as const,
  lists: () => [...visitKeys.all, 'list'] as const,
  list: (filters: GetVisitsRequest) => [...visitKeys.lists(), filters] as const,
};

/**
 * 取得預約列表
 * @param params - 查詢參數 (date, state, client_id, provider_id)
 */
export const useVisits = (params?: GetVisitsRequest) => {
  return useQuery({
    queryKey: visitKeys.list(params || {}),
    queryFn: () => visitsApi.getVisits(params),
  });
};

/**
 * 取消預約
 */
export const useCancelVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => visitsApi.cancelVisit(id),
    onSuccess: () => {
      // 重新獲取預約列表
      queryClient.invalidateQueries({ queryKey: visitKeys.lists() });
    },
  });
};
