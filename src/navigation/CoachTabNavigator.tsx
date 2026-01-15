import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAppSelector } from 'src/store/hooks';
import {
  Icon,
} from 'src/components';
import type { AdminTabParamList } from './types';
import { Colors } from 'src/theme';

// Stacks
import { CustomerStack } from './stacks/admin/CustomerStack';

import {
  NotificationsScreen,
  LoginPage,
  ProfileScreen,
} from 'src/screens/shared';
// Screens
import CourseManagementScreen from 'src/screens/coach/CourseManagementScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const tabBarActiveTintColor = Colors.primary;
const tabBarInactiveTintColor = '#D6D6D6';

const AdminTabNavigator = () => {
  const insets = useSafeAreaInsets();

  // 取得未讀通知數量
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

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
        name="CustomerManagement"
        component={CustomerStack}
        options={({ navigation }) => ({
          title: '客戶管理',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="customer_management" size={size} color={color} />
          ),
          headerRight: () => {
            const rootNavigation = navigation.getParent() as NativeStackNavigationProp<RootStackParamList>;
            return (
              <TouchableOpacity
                onPress={() => rootNavigation.navigate('CreateCustomer')}
                style={styles.rightButtonContainer}>
                <Text style={styles.rightButtonText}>+ 新增客戶</Text>
              </TouchableOpacity>
            );
          },
        })}
      />
      <Tab.Screen
        name="CourseManagement"
        component={CourseManagementScreen}
        options={{
          title: '課程管理',
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
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
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

const styles = StyleSheet.create({
  rightButtonText: {
    color: 'white',
  },
  rightButtonContainer: {
    padding: 8,
  },
});

export default AdminTabNavigator;
