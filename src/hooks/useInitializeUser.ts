import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useMe } from 'src/services/hooks';
import { setUserProfile, setUserLoading, setUserError } from 'src/store/slices/userSlice';

/**
 * 自動初始化使用者資料的 Hook
 * 根據用戶角色自動呼叫對應的 API 並儲存到 Redux
 * - Coach: 調用 /api/v4.1/users/me
 * - Client: 調用 /api/v4/clients/me
 */
export const useInitializeUser = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  // 只有在登入時才呼叫 useMe
  // React Query 的 enabled 會在 isAuthenticated 變更時立即反應
  const shouldFetchUser = isAuthenticated && !profile;

  console.log('🔍 useInitializeUser - isAuthenticated:', isAuthenticated, 'userRole:', userRole, 'shouldFetchUser:', shouldFetchUser);

  const { data: userData, isLoading, error } = useMe(shouldFetchUser);

  useEffect(() => {
    if (!shouldFetchUser) {
      return;
    }

    // 更新 loading 狀態
    dispatch(setUserLoading(isLoading));

    // 如果成功取得資料，儲存到 Redux
    if (userData && !isLoading) {
      console.log('✅ User data loaded:', userData, 'userRole:', userRole);
      dispatch(setUserProfile(userData));
    }

    // 如果發生錯誤
    if (error && !isLoading) {
      console.error('❌ Failed to load user data:', error);
      dispatch(setUserError(error.message || 'Failed to load user data'));
    }
  }, [userData, isLoading, error, shouldFetchUser, dispatch, userRole]);

  return {
    isLoading: shouldFetchUser ? isLoading : false, // 只有在應該 fetch 時才返回 loading 狀態
    error,
    profile,
  };
};
