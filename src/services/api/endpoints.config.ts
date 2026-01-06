/**
 * API 端點配置 - 支援多 app、多角色
 *
 * 架構說明：
 * - 2 個 App: SPA, BB (Buddy Body)
 * - 2 種角色: Coach (教練), Client (客戶/學員)
 * - 不同角色使用不同的登入方式和 API 端點
 *
 * 登入方式：
 * - Coach: 帳號密碼登入 (SIGN_IN)
 * - Client: 手機驗證碼登入 (SEND_VERIFICATION_CODE)
 */

export type AppType = 'spa' | 'bb';
export type UserRole = 'coach' | 'client';

// Auth 端點（依角色區分）
const AUTH_ENDPOINTS = {
  // Coach 登入
  COACH_SIGN_IN: '/api/v4/users/sign_in',

  // Client 登入
  CLIENT_SEND_CODE: '/api/v4/clients/mobile_sms_code',
  CLIENT_VERIFY_CODE: '/api/v4/clients/register_mobile_with_code',
};

// 教練端專用端點
const COACH_ENDPOINTS = {
  USER_ME: '/api/v4.1/users/me',
  UPDATE_DEVICE: '/api/v4/users/me/update_device',
  // 客戶管理
  CLIENTS: '/api/spa/user/v1/clients',
  CLIENT_DETAIL: (id: number) => `/api/spa/user/v1/clients/${id}`,

  // 類別列表
  CATEGORIES: '/api/spa/user/v1/categories',

  // 合約管理
  CONTRACTS: '/api/spa/user/v1/contracts',
  AVAILABLE_CONTRACT: '/api/spa/user/v1/contracts/available_contract',
  FIND_CONTRACTS_BY_MOBILE: '/api/spa/user/v1/contracts/find_by_mobile',

  // 共用合約管理
  SHARE_CONTRACTS: '/api/spa/user/v1/share_contracts',

  // 合約預約管理 (Contract Visits)
  VISITS: '/api/spa/user/v1/contract_visits',
  CANCEL_CONTRACT_VISIT: (id: number) => `/api/spa/user/v1/contract_visits/${id}/cancel`,
  SUBMIT_CONTRACT_VISIT_FOR_VERIFICATION: (id: number) => `/api/spa/user/v1/contract_visits/${id}/submit_for_verification`,

  // 預約系統 (SimplyBook)
  SERVICES: '/api/spa/user/v1/simply_book/services',
  PROVIDERS: '/api/spa/user/v1/simply_book/providers',
  SCHEDULES: '/api/spa/user/v1/simply_book/schedules',
  SLOTS: '/api/spa/user/v1/simply_book/slots',
  FIRST_AVAILABLE_SLOT: '/api/spa/user/v1/simply_book/slots/first_available_slot',
  BOOKINGS: '/api/spa/user/v1/simply_book/bookings',
};

// 客戶端專用端點
const CLIENT_ENDPOINTS = {
  CLIENT_ME: '/api/v4/clients/me',
  UPDATE_DEVICE: '/api/v4/clients/me/update_device',

  // 客戶管理
  CLIENTS: '/api/spa/client/v1/clients',
  CLIENT_DETAIL: (id: number) => `/api/spa/client/v1/clients/${id}`,

  // 合約管理
  CONTRACTS: '/api/spa/client/v1/contracts',
  AVAILABLE_CONTRACT: '/api/spa/client/v1/contracts/available_contract',
  FIND_CONTRACTS_BY_MOBILE: '/api/spa/client/v1/contracts/find_by_mobile',

  // 合約預約管理 (Contract Visits)
  VISITS: '/api/spa/client/v1/contract_visits',
  CANCEL_CONTRACT_VISIT: (id: number) => `/api/spa/client/v1/contract_visits/${id}/cancel`,
  COMPLETE_CONTRACT_VISIT: (id: number) => `/api/spa/client/v1/contract_visits/${id}/complete`,

  // 預約系統 (SimplyBook)
  SERVICES: '/api/spa/client/v1/simply_book/services',
  PROVIDERS: '/api/spa/client/v1/simply_book/providers',
  SCHEDULES: '/api/spa/client/v1/simply_book/schedules',
  SLOTS: '/api/spa/client/v1/simply_book/slots',
  FIRST_AVAILABLE_SLOT: '/api/spa/client/v1/simply_book/slots/first_available_slot',
  BOOKINGS: '/api/spa/client/v1/simply_book/bookings',
};

/**
 * 根據角色取得端點配置
 */
export const getEndpoints = (role: UserRole = 'coach') => {
  console.log(role, 'shaunrole')
  if (role === 'coach') {
    return {
      ...AUTH_ENDPOINTS,
      ...COACH_ENDPOINTS,
    };
  } else {
    return {
      ...AUTH_ENDPOINTS,
      ...CLIENT_ENDPOINTS,
    };
  }
};

/**
 * 預設使用教練端端點（向下相容）
 */
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...COACH_ENDPOINTS,
};

// Export 所有端點供參考
export { AUTH_ENDPOINTS, COACH_ENDPOINTS, CLIENT_ENDPOINTS };
