import React, { useEffect } from 'react';
import { useAppDispatch } from 'src/store/hooks';
import { checkAuthStatus } from 'src/store/slices/authSlice';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  // 應用啟動時檢查登入狀態
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <>{children}</>;
};
