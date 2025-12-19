import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService, UserData } from 'src/services/storage.service';
import { authApi } from 'src/services/api';
import { AppConfig } from 'src/config/AppConfig';
import { clearUserProfile } from './userSlice';

type User = UserData;

interface AuthState {
  user: User | null;
  token: string | null;
  userRole: 'coach' | 'client' | null; // 用戶角色：教練或客戶
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// 檢查登入狀態
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storageService.getAuthToken();
      const userData = await storageService.getUserData();
      const userRole = await storageService.getUserRole();

      if (token && userData) {
        return {
          token,
          user: userData,
          userRole: userRole || 'coach', // 預設為 coach 以向下相容
        };
      }
      return rejectWithValue('No auth data');
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  }
);

// 帳號密碼登入
export const loginWithAccount = createAsyncThunk(
  'auth/loginWithAccount',
  async (
    { account, password }: { account: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 根據 APP_TYPE 決定 app_name
      const appName = AppConfig.APP_TYPE === 'spa' ? 'spa' : 'buddy_body';

      // 呼叫登入 API
      const response = await authApi.signIn({
        app_name: appName,
        email: account,
        password,
        source: 'cofit',
      });

      // 驗證回應
      if (!response.access_token) {
        console.error('❌ API 回應缺少 access_token:', response);
        throw new Error('登入回應格式錯誤：缺少 access_token');
      }

      // 組裝用戶資料
      const userData: UserData = {
        account,
        name: response.nick_name || `${response.first_name} ${response.last_name}`,
        first_name: response.first_name,
        last_name: response.last_name,
        nick_name: response.nick_name,
        avatar_thumbnail_url: response.avatar_thumbnail_url,
        hasura_token: response.hasura_token,
      };

      // 儲存到 Storage
      await storageService.setAuthToken(response.access_token);
      await storageService.setUserData(userData);
      await storageService.setUserRole('coach'); // 儲存用戶角色

      return {
        token: response.access_token,
        user: userData,
        userRole: 'coach' as const, // 帳號密碼登入的是教練
      };
    } catch (error: any) {
      return rejectWithValue(error.message || '登入失敗');
    }
  }
);

// 手機驗證碼登入
export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async (
    { phone, verificationCode }: { phone: string; verificationCode: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🔐 手機驗證碼登入:', { phone, verificationCode });

      // 調用 API
      const response = await authApi.verifyCode(phone, verificationCode);

      console.log('📱 手機登入成功，API 回應:', response);

      // 構建用戶資料
      const userData = {
        phone,
        name: response.nick_name || `${response.first_name} ${response.last_name}`.trim() || '用戶',
        first_name: response.first_name,
        last_name: response.last_name,
        nick_name: response.nick_name,
        avatar_thumbnail_url: response.avatar_thumbnail_url,
        hasura_token: response.hasura_token,
      };

      // 儲存到 Storage
      await storageService.setAuthToken(response.access_token);
      await storageService.setUserData(userData);
      await storageService.setUserRole('client'); // 儲存用戶角色

      console.log('✅ 手機登入成功，已儲存 token 和用戶資料');

      return {
        token: response.access_token,
        user: userData,
        userRole: 'client' as const, // 手機登入的是客戶
      };
    } catch (error: any) {
      console.error('❌ 手機登入失敗:', error);
      return rejectWithValue(error.message || '登入失敗');
    }
  }
);

// 發送驗證碼
export const sendVerificationCode = createAsyncThunk(
  'auth/sendVerificationCode',
  async (phone: string, { rejectWithValue }) => {
    try {
      // TODO: 替換成實際的 API 呼叫
      // const response = await fetch('YOUR_API_URL/send-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone }),
      // });

      // 模擬 API 回應
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
      console.log('發送驗證碼到:', phone);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || '發送驗證碼失敗');
    }
  }
);

// 登出
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await storageService.clearAuthData();
      // 清除使用者資料
      dispatch(clearUserProfile());
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || '登出失敗');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 檢查登入狀態
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // 帳號密碼登入
    builder
      .addCase(loginWithAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
        state.error = null;
      })
      .addCase(loginWithAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 手機驗證碼登入
    builder
      .addCase(loginWithPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
        state.error = null;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 登出
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.userRole = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
