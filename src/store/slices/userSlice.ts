import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 使用者資料介面（從 /users/me API 取得）
 */
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  nick_name?: string;
  avatar_thumbnail_url?: string;
  role?: string;
  [key: string]: any; // 允許其他 API 回傳的欄位
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setUserProfile,
  setUserLoading,
  setUserError,
  clearUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
