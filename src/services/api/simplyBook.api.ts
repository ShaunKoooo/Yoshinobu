import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints.config';
import type {
  Service,
  Provider,
  Schedule,
  GetSchedulesRequest,
  GetSlotsRequest,
  GetSlotsResponse,
  FirstAvailableSlotRequest,
  FirstAvailableSlot,
  CreateBookingRequest,
  CreateBookingResponse,
} from './types';

/**
 * SimplyBook 預約系統 API
 */
export const simplyBookApi = {
  /**
   * 取得服務項目列表
   */
  getServices: async (): Promise<Service[]> => {
    return await apiClient.get<Service[]>(API_ENDPOINTS.SERVICES);
  },

  /**
   * 取得服務提供者列表 (教練/治療師)
   */
  getProviders: async (): Promise<Provider[]> => {
    return await apiClient.get<Provider[]>(API_ENDPOINTS.PROVIDERS);
  },

  /**
   * 取得日程表 (可用時段)
   * @param params - { date_from, date_to, provider_id?, service_id? }
   */
  getSchedules: async (params: GetSchedulesRequest): Promise<Schedule[]> => {
    return await apiClient.get<Schedule[]>(API_ENDPOINTS.SCHEDULES, params);
  },

  /**
   * 取得特定日期的時段
   * @param params - { date, provider_id, service_id }
   */
  getSlots: async (params: GetSlotsRequest): Promise<GetSlotsResponse> => {
    return await apiClient.get<GetSlotsResponse>(API_ENDPOINTS.SLOTS, params);
  },

  /**
   * 取得第一個可用時段
   * @param params - { provider_id, service_id }
   */
  getFirstAvailableSlot: async (
    params: FirstAvailableSlotRequest
  ): Promise<FirstAvailableSlot> => {
    return await apiClient.get<FirstAvailableSlot>(
      API_ENDPOINTS.FIRST_AVAILABLE_SLOT,
      params
    );
  },

  /**
   * 建立預約
   * @param data - 預約資料
   */
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    return await apiClient.post<CreateBookingResponse>(
      API_ENDPOINTS.BOOKINGS,
      data
    );
  },
};
