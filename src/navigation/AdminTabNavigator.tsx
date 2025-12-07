import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'src/components/FontelloIconByName';
import type {AdminTabParamList} from './types';

// Screens
import CustomerManagementScreen from 'src/screens/admin/CustomerManagementScreen';
import CourseManagementScreen from 'src/screens/admin/CourseManagementScreen';
import NotificationsScreen from 'src/screens/shared/NotificationsScreen';
import ProfileScreen from 'src/screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const tabBarActiveTintColor = '#B49162';
const tabBarInactiveTintColor = '#D6D6D6';

const AdminTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          height: 40 + insets.bottom,
          paddingTop: 8,
        },
      }}>
      <Tab.Screen
        name="CustomerManagement"
        component={CustomerManagementScreen}
        options={{
          title: '客戶管理',
          tabBarIcon: ({color, size}) => (
            <Icon name="customer_management" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CourseManagement"
        component={CourseManagementScreen}
        options={{
          title: '課程管理',
          tabBarIcon: ({color, size}) => (
            <Icon name="management" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: '通知',
          tabBarIcon: ({color, size}) => (
            <Icon name="notification" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({color, size}) => (
            <Icon name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
