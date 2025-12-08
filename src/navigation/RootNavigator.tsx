import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
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
  // 未來從 auth state 取得角色
  // const userRole = useAppSelector(state => state.auth.role);

  // 暫時先顯示 Admin
  const isAdmin = true;

  // 根據角色切換不同的 Navigator
  if (isAdmin) {
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
  }

  // return <UserTabNavigator />;
  return <AdminTabNavigator />; // 暫時
};

export default RootNavigator;
