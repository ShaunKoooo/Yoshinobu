import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import { Icon } from 'src/components';
import AdminTabNavigator from './AdminTabNavigator';
// import UserTabNavigator from './UserTabNavigator'; // 未來使用

// Screens
import {
  AddCustomerScreen,
  CustomerDetailScreen,
} from 'src/screens/admin';

export type RootStackParamList = {
  AdminTabs: undefined;
  AddCustomer: undefined;
  CustomerDetail: { customerId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // 從環境變數或 auth state 取得 App 類型
  // const userRole = useAppSelector(state => state.auth.role);
  const appType = Config.APP_TYPE;

  // 根據環境變數決定是哪個 App
  // 如果是 client app，直接顯示教練後台
  // 如果是 user app，可以根據登入狀態顯示 User 或 Client
  const isClient = appType === 'client';

  // 根據角色切換不同的 Navigator
  if (isClient) {
    return null;
  }

  // return <UserTabNavigator />;
  return <AdminTabNavigator />; // 暫時
};

export default RootNavigator;
