import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from 'src/navigation/stacks/admin/CustomerStack';
import {
  BasicInfoTab,
  ContractManagementTab,
  VerificationRecordsTab,
} from 'src/screens/admin';
import { Icon } from 'src/components';

export type CustomerDetailTabParamList = {
  BasicInfo: undefined;
  ContractManagement: undefined;
  VerificationRecords: undefined;
};

const Tab = createMaterialTopTabNavigator<CustomerDetailTabParamList>();

const CustomerDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const [currentTab, setCurrentTab] = React.useState<keyof CustomerDetailTabParamList>('BasicInfo');

  useLayoutEffect(() => {
    // 根據當前 Tab 更新 header 右側按鈕
    const getHeaderRight = () => {
      switch (currentTab) {
        case 'BasicInfo':
          return () => (
            <TouchableOpacity
              onPress={() => {
                console.log('編輯基本資料');
                // TODO: 導航到編輯頁面
              }}
              style={styles.rightButtonContainer}>
              <Icon name="pen" size={16} color="white" />
            </TouchableOpacity>
          );
        case 'ContractManagement':
          return () => (
            <TouchableOpacity
              onPress={() => {
                console.log('新增合約');
                // TODO: 導航到新增合約頁面
              }}
              style={styles.rightButtonContainer}>
              <Text style={styles.rightButtonText}>+ 新增合約</Text>
            </TouchableOpacity>
          );
        case 'VerificationRecords':
          return () => (
            <TouchableOpacity
              onPress={() => {
                console.log('匯出核銷紀錄');
                // TODO: 實作匯出功能
              }}
              style={styles.rightButtonContainer}>
              <Text style={styles.rightButtonText}>+ 新增預約</Text>
            </TouchableOpacity>
          );
        default:
          return undefined;
      }
    };

    navigation.setOptions({
      headerRight: getHeaderRight(),
    });
  }, [navigation, currentTab]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#B49162',
        tabBarInactiveTintColor: '#A2A2A2',
        tabBarIndicatorStyle: {
          backgroundColor: '#B49162',
          height: 2,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '400',
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
      screenListeners={{
        state: (e) => {
          // 當 Tab 切換時更新 currentTab
          const state = e.data.state;
          const index = state.index;
          const routeName = state.routes[index].name as keyof CustomerDetailTabParamList;
          setCurrentTab(routeName);
        },
      }}>
      <Tab.Screen
        name="BasicInfo"
        component={BasicInfoTab}
        options={{
          tabBarLabel: '基本資料',
        }}
      />
      <Tab.Screen
        name="ContractManagement"
        component={ContractManagementTab}
        options={{
          tabBarLabel: '合約管理',
        }}
      />
      <Tab.Screen
        name="VerificationRecords"
        component={VerificationRecordsTab}
        options={{
          tabBarLabel: '核銷紀錄',
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

export default CustomerDetailScreen;