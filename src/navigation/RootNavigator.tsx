import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { AppConfig } from 'src/config/AppConfig';
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

  // Debug: 顯示所有環境變數
  console.log('=== 環境變數 Debug ===');
  console.log('APP_TYPE:', AppConfig.APP_TYPE);
  console.log('APP_NAME:', AppConfig.APP_NAME);
  console.log('APP_DISPLAY_NAME:', AppConfig.APP_DISPLAY_NAME);
  console.log('API_URL:', AppConfig.API_URL);
  console.log('====================');

  // 根據環境變數決定是哪個 App
  const isSPAApp = AppConfig.APP_TYPE === 'spa';
  const isBBApp = AppConfig.APP_TYPE === 'bb';

  console.log('isSPAApp:', isSPAApp, 'isBBApp:', isBBApp);

  // 目前兩個 App 都使用相同的界面
  // 未來可以根據 APP_TYPE 載入不同的 Navigator
  // 登入後根據 userRole 切換學員/教練界面

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: '',
      }}>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={({ navigation }) => ({
          title: '新增客戶',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 8 }}>
              <Icon name="left-open-big" size={20} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={({ navigation }) => ({
          title: '客戶詳情',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 8 }}>
              <Icon name="left-open-big" size={20} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
