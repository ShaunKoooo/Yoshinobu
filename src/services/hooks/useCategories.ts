import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, contractsApi, shareContractsApi } from '../api';
import type {
  GetContractsRequest,
  CreateContractRequest,
  CreateShareContractRequest,
  GetAvailableContractRequest,
} from '../api/types';

/**
 * React Query hooks for Categories, Contracts, and Share Contracts
 */

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: (clientId: number | undefined) => [...contractKeys.lists(), clientId] as const,
  availableContract: (params: GetAvailableContractRequest) => [...contractKeys.all, 'available', params] as const,
};

export const shareContractKeys = {
  all: ['shareContracts'] as const,
};

/**
 * 取得所有類別
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 取得客戶的合約列表
 */
export const useContracts = (params: GetContractsRequest, enabled = true) => {
  return useQuery({
    queryKey: contractKeys.list(params.client_id),
    queryFn: () => contractsApi.getContracts(params),
    enabled: enabled && !!params.client_id,
  });
};

/**
 * 建立合約
 */
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractRequest) => contractsApi.createContract(data),
    onSuccess: (_, variables) => {
      // 重新獲取該客戶的合約列表
      queryClient.invalidateQueries({ queryKey: contractKeys.list(variables.client_id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * 取得可用的合約
 * 根據 service_id 和 consumed_time 找出最舊且剩餘時間足夠的合約
 * @param params - 查詢參數 (service_id, consumed_time, client_id)
 * @param enabled - 是否啟用查詢
 */
export const useAvailableContract = (
  params: GetAvailableContractRequest,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: contractKeys.availableContract(params),
    queryFn: () => contractsApi.getAvailableContract(params),
    enabled: enabled && !!params.service_id && !!params.consumed_time,
  });
};

/**
 * 建立共用合約
 */
export const useCreateShareContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShareContractRequest) =>
      shareContractsApi.createShareContract(data),
    onSuccess: () => {
      // 重新獲取相關資料
      queryClient.invalidateQueries({ queryKey: shareContractKeys.all });
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
