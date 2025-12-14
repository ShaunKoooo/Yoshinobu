import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '../api';
import type { CreateClientRequest, UpdateClientRequest } from '../api/types';

/**
 * React Query hooks for Client Management
 */

// Query Keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: number) => [...clientKeys.details(), id] as const,
};

/**
 * 取得客戶列表
 */
export const useClients = () => {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => clientsApi.getClients(),
  });
};

/**
 * 取得單一客戶詳情
 */
export const useClient = (id: number, enabled = true) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsApi.getClient(id),
    enabled: enabled && !!id,
  });
};

/**
 * 建立新客戶
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientsApi.createClient(data),
    onSuccess: () => {
      // 重新獲取客戶列表
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
};

/**
 * 更新客戶資料
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClientRequest }) =>
      clientsApi.updateClient(id, data),
    onSuccess: (_, variables) => {
      // 重新獲取客戶列表和詳情
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
    },
  });
};
