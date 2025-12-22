import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractVisitsApi } from '../api/contractVisits.api';
import type { GetContractVisitsRequest } from '../api/types';

/**
 * React Query hooks for Contract Visit Management
 */

// Query Keys
export const contractVisitKeys = {
  all: ['contractVisits'] as const,
  lists: () => [...contractVisitKeys.all, 'list'] as const,
  list: (filters: GetContractVisitsRequest) => [...contractVisitKeys.lists(), filters] as const,
};

/**
 * 取得合約預約列表
 * @param params - 查詢參數 (status)
 */
export const useContractVisits = (params?: GetContractVisitsRequest) => {
  return useQuery({
    queryKey: contractVisitKeys.list(params || {}),
    queryFn: () => contractVisitsApi.getContractVisits(params),
  });
};

/**
 * 會員提交預約待核銷 (Coach only)
 */
export const useSubmitContractVisitForVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contractVisitsApi.submitForVerification(id),
    onSuccess: () => {
      // 重新獲取合約預約列表
      queryClient.invalidateQueries({ queryKey: contractVisitKeys.lists() });
    },
  });
};

/**
 * 客戶確認完成預約 (Client only)
 */
export const useCompleteContractVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contractVisitsApi.completeVisit(id),
    onSuccess: () => {
      // 重新獲取合約預約列表
      queryClient.invalidateQueries({ queryKey: contractVisitKeys.lists() });
    },
  });
};
