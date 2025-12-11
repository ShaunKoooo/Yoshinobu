import { API_CONFIG } from './config';
import { AUTH_ENDPOINTS } from './endpoints.config';

// 登入請求類型
export interface SignInRequest {
  app_name: 'spa' | 'buddy_body';
  email: string;
  password: string;
  source: string;
}

// 登入回應類型
export interface SignInResponse {
  access_token: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  avatar_thumbnail_url: string | null;
  terms_of_service_agreed: boolean | null;
  hasura_token: string;
}

// 發送驗證碼請求
export interface SendVerificationCodeRequest {
  phone: string;
}

export const authApi = {
  /**
   * 教練登入（帳號密碼）
   */
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    console.log('🔐 登入 API 請求:', data);

    const url = `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.COACH_SIGN_IN}`;

    // 注意：這裡不使用 apiClient 因為登入時還沒有 token
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📡 API 回應狀態:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ 登入失敗:', error);
      throw new Error(error.message || '登入失敗');
    }

    const result = await response.json();
    console.log('✅ 登入成功，API 回應:', result);

    return result;
  },

  /**
   * 發送手機驗證碼
   */
  sendVerificationCode: async (phone: string): Promise<{ success: boolean }> => {
    const response = await fetch('https://staging.cofit.me/api/v4/users/send_verification_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || '發送驗證碼失敗');
    }

    return await response.json();
  },
};
