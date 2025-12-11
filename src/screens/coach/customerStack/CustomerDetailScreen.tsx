import React, { useLayoutEffect, createContext, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import {
  BasicInfoTab,
  ContractManagementTab,
  VerificationRecordsTab,
} from 'src/screens/coach';
import { Icon } from 'src/components';
import { Colors } from 'src/theme';

export type CustomerDetailTabParamList = {
  BasicInfo: undefined;
  ContractManagement: undefined;
  VerificationRecords: undefined;
};

interface BasicInfoEditContextType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const BasicInfoEditContext = createContext<BasicInfoEditContextType | undefined>(undefined);

export const useBasicInfoEdit = () => {
  const context = useContext(BasicInfoEditContext);
  if (!context) {
    throw new Error('useBasicInfoEdit must be used within BasicInfoEditContext.Provider');
  }
  return context;
};

const Tab = createMaterialTopTabNavigator<CustomerDetailTabParamList>();

const CustomerDetailScreen = () => {
  // Adjust the type to allow navigation to 'AddContract'
  const navigation = useNavigation<any>();
  const [currentTab, setCurrentTab] = React.useState<keyof CustomerDetailTabParamList>('BasicInfo');
  const [isEditingBasicInfo, setIsEditingBasicInfo] = React.useState(false);

  const handleToggleEditBasicInfo = () => {
    if (isEditingBasicInfo) {
      // TODO: 儲存資料到 API
      console.log('儲存基本資料');
    }
    setIsEditingBasicInfo(!isEditingBasicInfo);
  };

  useLayoutEffect(() => {
    // 根據當前 Tab 更新 header 右側按鈕
    const getHeaderRight = () => {
      switch (currentTab) {
        case 'BasicInfo':
          return () => (
            <TouchableOpacity
              onPress={handleToggleEditBasicInfo}
              style={styles.rightButtonContainer}>
              {isEditingBasicInfo ? (
                <Text style={styles.rightButtonText}>儲存</Text>
              ) : (
                <Icon name="pen" size={16} color="white" />
              )}
            </TouchableOpacity>
          );
        case 'ContractManagement':
          return () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddContract');
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
  }, [navigation, currentTab, isEditingBasicInfo]);

  return (
    <BasicInfoEditContext.Provider
      value={{
        isEditing: isEditingBasicInfo,
        setIsEditing: setIsEditingBasicInfo,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#A2A2A2',
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primary,
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
    </BasicInfoEditContext.Provider>
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