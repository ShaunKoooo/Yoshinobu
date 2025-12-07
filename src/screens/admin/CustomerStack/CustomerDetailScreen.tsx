import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  BasicInfoTab,
  ContractManagementTab,
  VerificationRecordsTab,
} from 'src/screens/admin';

export type CustomerDetailTabParamList = {
  BasicInfo: undefined;
  ContractManagement: undefined;
  VerificationRecords: undefined;
};

const Tab = createMaterialTopTabNavigator<CustomerDetailTabParamList>();

const CustomerDetailScreen = () => {
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

export default CustomerDetailScreen;