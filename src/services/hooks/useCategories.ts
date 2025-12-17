import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, contractsApi, shareContractsApi } from '../api';
import type {
  CreateContractRequest,
  CreateShareContractRequest,
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
 * 建立合約
 */
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractRequest) => contractsApi.createContract(data),
    onSuccess: () => {
      // 重新獲取相關資料
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
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
