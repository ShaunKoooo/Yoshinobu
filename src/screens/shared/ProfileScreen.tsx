import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  MyButton,
  MyListItem,
} from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { Colors } from 'src/theme';
import { logout } from 'src/store/slices/authSlice';
import { useInitializeUser } from 'src/hooks';
import {
  BasicInfoTab,
  ContractManagementTab,
  VerificationRecordsTab,
} from 'src/screens/coach';
import { BasicInfoEditContext } from 'src/screens/coach/customerStack/CustomerDetailScreen';

const PROFILE_FIELDS = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: '姓名',
  },
  {
    key: 'email',
    label: '電子郵件',
  },
  {
    key: 'version',
    label: '版本',
    getValue: () => `${DeviceInfo.getVersion()} - ${DeviceInfo.getBuildNumber()}`,
  },
]

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { userRole } = useAppSelector((state) => state.auth);
  const { isLoading, error, profile } = useInitializeUser();

  // BasicInfoEditContext 相關狀態
  const [isEditingBasicInfo, setIsEditingBasicInfo] = React.useState(false);
  const saveHandlerRef = React.useRef<(() => void) | null>(null);

  const setSaveHandler = React.useCallback((handler: () => void) => {
    saveHandlerRef.current = handler;
  }, []);

  const exitEditMode = React.useCallback(() => {
    setIsEditingBasicInfo(false);
  }, []);

  const renderProfileItem = ({ item }) => {
    const { label, key, getValue } = item || {};
    const value = getValue ? getValue() : profile?.[key] || '-';

    return (
      <View style={styles.profileItem}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    )
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>載入失敗: {String(error)}</Text>
        <MyButton
          title="登出"
          isActive
          onPress={() => {
            dispatch(logout());
          }}
        />
      </View>
    );
  }

  // 如果是 client 角色，顯示 CustomerDetailScreen 的 Tab Navigator
  if (userRole === 'client' && profile?.id) {
    return (
      <BasicInfoEditContext.Provider
        value={{
          isEditing: isEditingBasicInfo,
          setIsEditing: setIsEditingBasicInfo,
          setSaveHandler,
          exitEditMode,
        }}
      >
        <View style={styles.container}>
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
            }}>
            <Tab.Screen
              name="BasicInfo"
              component={BasicInfoTab}
              initialParams={{ id: profile.id }}
              options={{
                tabBarLabel: '基本資料',
              }}
            />
            <Tab.Screen
              name="ContractManagement"
              component={ContractManagementTab}
              initialParams={{ id: profile.id }}
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

          {/* 登出按鈕 */}
          <View style={styles.buttonContainer}>
            <MyButton
              title="登出"
              isActive
              onPress={() => {
                dispatch(logout());
              }}
            />
          </View>
        </View>
      </BasicInfoEditContext.Provider>
    );
  }

  // 如果是 coach 角色，顯示原本的 profile 列表
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <MyListItem
          data={PROFILE_FIELDS}
          renderItem={renderProfileItem}
          keyExtractor={item => item.key}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          title="登出"
          isActive
          onPress={() => {
            dispatch(logout());
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    padding: 16,
    minHeight: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#48484A',
  },
  value: {
    fontSize: 16,
    color: '#8E8E93',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileScreen;
