import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { storageService, UserData } from 'src/services/storage.service';

type User = UserData;

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
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

      if (token && userData) {
        return {
          token,
          user: userData,
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
      // TODO: 替換成實際的 API 呼叫
      // const response = await fetch('YOUR_API_URL/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ account, password }),
      // });
      // const data = await response.json();

      // 模擬 API 回應
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUserData = { account, name: '測試用戶' };

      // 儲存到 Storage
      await storageService.setAuthToken(mockToken);
      await storageService.setUserData(mockUserData);

      return {
        token: mockToken,
        user: mockUserData,
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
      // TODO: 替換成實際的 API 呼叫
      // const response = await fetch('YOUR_API_URL/login/phone', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone, verificationCode }),
      // });
      // const data = await response.json();

      // 模擬 API 回應
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUserData = { phone, name: '測試用戶' };

      // 儲存到 Storage
      await storageService.setAuthToken(mockToken);
      await storageService.setUserData(mockUserData);

      return {
        token: mockToken,
        user: mockUserData,
      };
    } catch (error: any) {
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
      await new Promise((resolve) => setTimeout(resolve, 500));
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
  async (_, { rejectWithValue }) => {
    try {
      await storageService.clearAuthData();
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
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
