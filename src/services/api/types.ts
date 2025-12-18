/**
 * API 類型定義
 * 根據後端 API 定義的請求和回應格式
 */

// ==================== 客戶管理 ====================

export interface Client {
  client: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    gender: 'male' | 'female' | 'other';
    birthday?: string;
    address?: string;
    note?: string;
  }
}

export interface CreateClientRequest {
  name?: string;
  email?: string;
  mobile?: string;
  birthday?: string;
  gender?: 'male' | 'female';
  address?: string;
  note?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> { }

export interface GetClientsResponse {
  clients: Client[];
  total?: number;
}

// ==================== 預約管理 ====================

export type VisitState = 'reserved' | 'completed' | 'cancelled' | 'pending_verification';

export interface Visit {
  id: number;
  client_id: number;
  client_name: string;
  service_id: number;
  service_name: string;
  provider_id: number;
  provider_name: string;
  start_datetime: string;
  end_datetime: string;
  state: VisitState;
  duration: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface GetVisitsRequest {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  state?: VisitState;
  client_id?: number;
}

export interface GetVisitsResponse {
  visits: Visit[];
  total?: number;
}

export interface CancelVisitResponse {
  success: boolean;
  message?: string;
}

// ==================== 類別管理 ====================

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface GetCategoriesResponse {
  categories: Category[];
}

// ==================== 合約管理 ====================

export interface Contract {
  id: number;
  client_id: number;
  category_id: number;
  contract_time: number; // 合約時間（分鐘）
  remaining_time?: number; // 剩餘時間（分鐘）
  created_at: string;
  updated_at: string;
}

export interface GetContractsRequest {
  client_id: number | undefined;
}

export interface GetContractsResponse {
  contracts: Contract[];
}

export interface CreateContractRequest {
  client_id: number;
  category_id: number;
  contract_time: number;
}

export interface CreateContractResponse {
  contract: Contract;
}

// ==================== 共用合約管理 ====================

export interface ShareContract {
  id: number;
  client_id: number;
  contract_id: number;
  contract_time: number; // 分享的時間（分鐘）
  created_at: string;
  updated_at: string;
}

export interface CreateShareContractRequest {
  client_id: number;
  contract_id: number;
  contract_time: number;
}

export interface CreateShareContractResponse {
  share_contract: ShareContract;
}

// ==================== SimplyBook 預約系統 ====================

export interface Service {
  id: number;
  name: string;
  description?: string;
  duration: number; // minutes
  price?: number;
  is_active: boolean;
}

export interface Provider {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  specialties?: string[];
  is_active: boolean;
}

export interface Schedule {
  provider_id: number;
  provider_name: string;
  date: string; // YYYY-MM-DD
  available_slots: string[]; // ["09:00", "10:00", ...]
}

export interface GetSchedulesRequest {
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
  provider_id?: number;
  service_id?: number;
}

export interface Slot {
  time: string; // "HH:MM"
  available: boolean;
  provider_id: number;
  service_id: number;
}

export interface GetSlotsRequest {
  date: string; // YYYY-MM-DD
  provider_id: number;
  service_id: number;
}

export interface GetSlotsResponse {
  slots: Slot[];
  date: string;
}

export interface FirstAvailableSlotRequest {
  provider_id: number;
  service_id: number;
}

export interface FirstAvailableSlot {
  date: string; // YYYY-MM-DD
  time: string; // "HH:MM"
  datetime: string; // "YYYY-MM-DD HH:MM:SS"
}

export interface CreateBookingRequest {
  service_id: number;
  provider_id: number;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  client_id: number;
}

export interface CreateBookingResponse {
  id: number;
  client_id: number;
  service_id: number;
  provider_id: number;
  start_datetime: string;
  end_datetime: string;
  state: string;
  created_at: string;
}

// ==================== 通用回應 ====================

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
}
