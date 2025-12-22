import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Icon } from 'src/components';
import type { ClientTabParamList } from './types';
import { Colors } from 'src/theme';

// Screens
import {
  NotificationsScreen,
  ProfileScreen,
} from 'src/screens/shared';
import HomeScreen from 'src/screens/client/HomeScreen';
import CoursesScreen from 'src/screens/client/CoursesScreen';

const Tab = createBottomTabNavigator<ClientTabParamList>();
const tabBarActiveTintColor = Colors.primary;
const tabBarInactiveTintColor = '#D6D6D6';

const ClientTabNavigator = () => {
  const insets = useSafeAreaInsets();

  // Android 需要額外的底部 padding
  const tabBarHeight = Platform.OS === 'android' ? 70 : 40 + insets.bottom;
  const tabBarPaddingBottom = Platform.OS === 'android' ? 8 : insets.bottom;

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
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: tabBarPaddingBottom,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首頁',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          title: '課程',
          tabBarIcon: ({ color, size }) => (
            <Icon name="management" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: '通知',
          tabBarIcon: ({ color, size }) => (
            <Icon name="notification" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <Icon name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ClientTabNavigator;
