import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simplyBookApi } from '../api';
import type {
  GetSchedulesRequest,
  GetSlotsRequest,
  FirstAvailableSlotRequest,
  CreateBookingRequest,
} from '../api/types';

/**
 * React Query hooks for SimplyBook API
 */

// Query Keys
export const simplyBookKeys = {
  all: ['simplyBook'] as const,
  services: () => [...simplyBookKeys.all, 'services'] as const,
  providers: () => [...simplyBookKeys.all, 'providers'] as const,
  schedules: (params: GetSchedulesRequest) =>
    [...simplyBookKeys.all, 'schedules', params] as const,
  slots: (params: GetSlotsRequest) =>
    [...simplyBookKeys.all, 'slots', params] as const,
  firstAvailableSlot: (params: FirstAvailableSlotRequest) =>
    [...simplyBookKeys.all, 'firstAvailableSlot', params] as const,
};

/**
 * 取得服務項目列表
 */
export const useServices = () => {
  return useQuery({
    queryKey: simplyBookKeys.services(),
    queryFn: () => simplyBookApi.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 取得服務提供者列表
 */
export const useProviders = () => {
  return useQuery({
    queryKey: simplyBookKeys.providers(),
    queryFn: () => simplyBookApi.getProviders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 取得日程表
 */
export const useSchedules = (params: GetSchedulesRequest, enabled = true) => {
  return useQuery({
    queryKey: simplyBookKeys.schedules(params),
    queryFn: () => simplyBookApi.getSchedules(params),
    enabled: enabled && !!params.date_from && !!params.date_to,
  });
};

/**
 * 取得時段
 */
export const useSlots = (params: GetSlotsRequest, enabled = true) => {
  return useQuery({
    queryKey: simplyBookKeys.slots(params),
    queryFn: () => simplyBookApi.getSlots(params),
    enabled: enabled && !!params.date && !!params.provider_id && !!params.service_id,
  });
};

/**
 * 取得第一個可用時段
 */
export const useFirstAvailableSlot = (
  params: FirstAvailableSlotRequest,
  enabled = true
) => {
  return useQuery({
    queryKey: simplyBookKeys.firstAvailableSlot(params),
    queryFn: () => simplyBookApi.getFirstAvailableSlot(params),
    enabled: enabled && !!params.provider_id && !!params.service_id,
  });
};

/**
 * 建立預約
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => simplyBookApi.createBooking(data),
    onSuccess: () => {
      // 重新獲取相關資料
      queryClient.invalidateQueries({ queryKey: simplyBookKeys.all });
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};
