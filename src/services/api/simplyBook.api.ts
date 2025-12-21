import { apiClient } from './config';
import { COACH_ENDPOINTS, CLIENT_ENDPOINTS } from './endpoints.config';
import { storageService } from '../storage.service';
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
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.SERVICES
      : COACH_ENDPOINTS.SERVICES;
    console.log('📱 getServices - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.get<Service[]>(endpoint);
  },

  /**
   * 取得服務提供者列表 (教練/治療師)
   */
  getProviders: async (): Promise<Provider[]> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.PROVIDERS
      : COACH_ENDPOINTS.PROVIDERS;
    console.log('📱 getProviders - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.get<Provider[]>(endpoint);
  },

  /**
   * 取得日程表 (可用時段)
   * @param params - { date_from, date_to, provider_id?, service_id? }
   */
  getSchedules: async (params: GetSchedulesRequest): Promise<Schedule[]> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.SCHEDULES
      : COACH_ENDPOINTS.SCHEDULES;
    console.log('📱 getSchedules - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.get<Schedule[]>(endpoint, params);
  },

  /**
   * 取得特定日期的時段
   * @param params - { date, provider_id, service_id }
   */
  getSlots: async (params: GetSlotsRequest): Promise<GetSlotsResponse> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.SLOTS
      : COACH_ENDPOINTS.SLOTS;
    console.log('📱 getSlots - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.get<GetSlotsResponse>(endpoint, params);
  },

  /**
   * 取得第一個可用時段
   * @param params - { provider_id, service_id }
   */
  getFirstAvailableSlot: async (
    params: FirstAvailableSlotRequest
  ): Promise<FirstAvailableSlot> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.FIRST_AVAILABLE_SLOT
      : COACH_ENDPOINTS.FIRST_AVAILABLE_SLOT;
    console.log('📱 getFirstAvailableSlot - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.get<FirstAvailableSlot>(endpoint, params);
  },

  /**
   * 建立預約
   * @param data - 預約資料
   */
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const userRole = await storageService.getUserRole();
    const endpoint = userRole === 'client'
      ? CLIENT_ENDPOINTS.BOOKINGS
      : COACH_ENDPOINTS.BOOKINGS;
    console.log('📱 createBooking - userRole:', userRole, 'endpoint:', endpoint);
    return await apiClient.post<CreateBookingResponse>(endpoint, data);
  },
};
