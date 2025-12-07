import React from 'react';
import {useAppSelector} from 'src/store/hooks';
import AdminTabNavigator from './AdminTabNavigator';
// import UserTabNavigator from './UserTabNavigator'; // 未來使用

const RootNavigator = () => {
  // 未來從 auth state 取得角色
  // const userRole = useAppSelector(state => state.auth.role);

  // 暫時先顯示 Admin
  const isAdmin = true;

  // 根據角色切換不同的 Navigator
  if (isAdmin) {
    return <AdminTabNavigator />;
  }

  // return <UserTabNavigator />;
  return <AdminTabNavigator />; // 暫時
};

export default RootNavigator;
