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
  CLIENT_SEND_CODE: '/api/v4/users/send_verification_code',
  CLIENT_VERIFY_CODE: '/api/v4/users/verify_code', // 假設需要驗證端點
};

// 教練端專用端點
const COACH_ENDPOINTS = {
  // // 客戶管理
  // CLIENTS: '/api/v4/third_party_admin/clients',
  // CLIENT_DETAIL: (id: number) => `/api/v4/third_party_admin/clients/${id}`,

  // // 預約管理
  // VISITS: '/api/v4/third_party_admin/visits',
  // CANCEL_VISIT: (id: number) => `/api/v4/third_party_admin/visits/${id}/cancel`,

  // // 預約系統
  // SERVICES: '/v4/third_party_admin/simply_book/services',
  // PROVIDERS: '/v4/third_party_admin/simply_book/providers',
  // SCHEDULES: '/v4/third_party_admin/simply_book/schedules',
  // SLOTS: '/v4/third_party_admin/simply_book/slots',
  // FIRST_AVAILABLE_SLOT: '/v4/third_party_admin/simply_book/slots/first_available_slot',
  // BOOKINGS: '/v4/third_party_admin/simply_book/bookings',
};

// 客戶端專用端點（未來擴充）
const CLIENT_ENDPOINTS = {
  // 客戶端的 API 端點
  // 例如：
  // MY_PROFILE: '/api/v4/client/profile',
  // MY_BOOKINGS: '/api/v4/client/bookings',
  // ...
};

/**
 * 根據角色取得端點配置
 */
export const getEndpoints = (role: UserRole = 'coach') => {
  return {
    ...AUTH_ENDPOINTS,
    ...(role === 'coach' ? COACH_ENDPOINTS : CLIENT_ENDPOINTS),
  };
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
