import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useMe } from 'src/services/hooks';
import { setUserProfile, setUserLoading, setUserError } from 'src/store/slices/userSlice';
import { AppConfig } from 'src/config/AppConfig';

/**
 * 自動初始化使用者資料的 Hook
 * 當使用者登入且為教練身份時，自動呼叫 useMe API 並儲存到 Redux
 */
export const useInitializeUser = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  // 判斷是否為教練（根據 APP_TYPE）
  const isCoach = AppConfig.APP_TYPE === 'spa' || AppConfig.APP_TYPE === 'bb';

  // 只有在登入且為教練時才呼叫 useMe
  const shouldFetchUser = isAuthenticated && isCoach && !profile;

  const { data: userData, isLoading, error } = useMe();

  useEffect(() => {
    if (!shouldFetchUser) {
      return;
    }

    // 更新 loading 狀態
    dispatch(setUserLoading(isLoading));

    // 如果成功取得資料，儲存到 Redux
    if (userData && !isLoading) {
      console.log('✅ User data loaded:', userData);
      dispatch(setUserProfile(userData));
    }

    // 如果發生錯誤
    if (error && !isLoading) {
      console.error('❌ Failed to load user data:', error);
      dispatch(setUserError(error.message || 'Failed to load user data'));
    }
  }, [userData, isLoading, error, shouldFetchUser, dispatch]);

  return {
    isLoading,
    error,
    profile,
  };
};
