import { API_CONFIG } from './config';
import { AUTH_ENDPOINTS } from './endpoints.config';
import { AppConfig } from 'src/config/AppConfig';

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
  app_name: 'spa' | 'buddy_body';
  mobile: string;
  type: 'mobile_login_verify_code';
  t: number;
}

// 驗證碼登入請求
export interface VerifyCodeRequest {
  app_name: 'spa' | 'buddy_body';
  mobile: string;
  code: string;
}

// 驗證碼登入回應
export interface VerifyCodeResponse {
  access_token: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  avatar_thumbnail_url: string | null;
  terms_of_service_agreed: boolean | null;
  hasura_token: string;
}

export const authApi = {
  /**
   * 專家登入（帳號密碼）
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
   * 發送手機驗證碼（客戶端使用）
   */
  sendVerificationCode: async (mobile: string): Promise<{ ok: boolean }> => {
    console.log('📱 發送驗證碼 API 請求:', mobile);

    const app_name = AppConfig.APP_TYPE === 'spa' ? 'spa' : 'buddy_body';
    const data: SendVerificationCodeRequest = {
      app_name,
      mobile,
      type: 'mobile_login_verify_code',
      t: 1,
    };

    const url = `https://ff-staging.cofit.me${AUTH_ENDPOINTS.CLIENT_SEND_CODE}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer',
        'token': '',
      },
      body: JSON.stringify(data),
    });

    console.log('📡 API 回應狀態:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ 發送驗證碼失敗:', error);
      const errorMessage = error.errors || error.message || '發送驗證碼失敗';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ 發送驗證碼成功，API 回應:', result);

    return result;
  },

  /**
   * 驗證碼登入（客戶端使用）
   */
  verifyCode: async (mobile: string, code: string): Promise<VerifyCodeResponse> => {
    console.log('🔐 驗證碼登入 API 請求:', { mobile, code });

    const app_name = AppConfig.APP_TYPE === 'spa' ? 'spa' : 'buddy_body';
    const data: VerifyCodeRequest = {
      app_name,
      mobile,
      code,
    };

    const url = `https://ff-staging.cofit.me${AUTH_ENDPOINTS.CLIENT_VERIFY_CODE}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer',
        'token': '',
      },
      body: JSON.stringify(data),
    });

    console.log('📡 API 回應狀態:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ 驗證碼登入失敗:', error);
      const errorMessage = error.errors || error.message || '驗證碼登入失敗';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ 驗證碼登入成功，API 回應:', result);

    return result;
  },
};
