import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CodePush from '@code-push-next/react-native-code-push';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import {
  MyButton,
  MyListItem,
  Icon,
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
import { BUNDLE_BUILD } from 'src/constants/version';
import { useDeactivateCoachAccount, useDeactivateClientAccount } from 'src/services/hooks/useClients';

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
  },
  {
    key: 'deactivate',
    label: '刪除帳號',
    isAction: true,
  },
]

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { userRole } = useAppSelector((state) => state.auth);
  const { isLoading, error, profile } = useInitializeUser();

  // 停用帳號的 hooks
  const deactivateCoachAccount = useDeactivateCoachAccount();
  const deactivateClientAccount = useDeactivateClientAccount();

  // BasicInfoEditContext 相關狀態
  const [isEditingBasicInfo, setIsEditingBasicInfo] = React.useState(false);
  const saveHandlerRef = React.useRef<(() => void) | null>(null);

  // 版本資訊狀態
  const [versionInfo, setVersionInfo] = React.useState<string>('載入中...');

  const setSaveHandler = React.useCallback((handler: () => void) => {
    saveHandlerRef.current = handler;
  }, []);

  const exitEditMode = React.useCallback(() => {
    setIsEditingBasicInfo(false);
  }, []);

  // 處理編輯按鈕點擊
  const handleToggleEditBasicInfo = React.useCallback(() => {
    if (isEditingBasicInfo) {
      // 呼叫 BasicInfoTab 的儲存函數
      if (saveHandlerRef.current) {
        saveHandlerRef.current();
      }
    } else {
      setIsEditingBasicInfo(true);
    }
  }, [isEditingBasicInfo]);

  // 設定 header 右側的編輯/儲存按鈕（僅針對 client 角色）
  React.useLayoutEffect(() => {
    if (userRole === 'client') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={handleToggleEditBasicInfo}
            style={styles.headerRightButton}
          >
            {isEditingBasicInfo ? (
              <Text style={styles.headerRightButtonText}>儲存</Text>
            ) : (
              <Icon name="pen" size={16} color="white" />
            )}
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, userRole, isEditingBasicInfo, handleToggleEditBasicInfo]);

  // 處理刪除帳號
  const handleDeactivateAccount = React.useCallback(() => {
    Alert.alert(
      '刪除帳號',
      '確定要刪除帳號嗎？此操作無法復原。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定刪除',
          style: 'destructive',
          onPress: async () => {
            try {
              if (userRole === 'coach') {
                // Coach 端：刪除自己的帳號（使用 profile.id）
                await deactivateCoachAccount.mutateAsync(profile?.id);
              } else {
                // Client 端：刪除自己的帳號
                await deactivateClientAccount.mutateAsync();
              }

              Alert.alert('成功', '帳號已刪除', [
                {
                  text: '確定',
                  onPress: () => {
                    dispatch(logout());
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('錯誤', '刪除帳號失敗，請稍後再試');
              console.error('刪除帳號失敗:', error);
            }
          },
        },
      ]
    );
  }, [userRole, profile?.id, deactivateCoachAccount, deactivateClientAccount, dispatch]);

  // 載入版本資訊
  React.useEffect(() => {
    const loadVersionInfo = async () => {
      const nativeVersion = DeviceInfo.getVersion();
      const buildNumber = DeviceInfo.getBuildNumber();

      try {
        const metadata = await CodePush.getUpdateMetadata();
        if (metadata) {
          // 如果有 CodePush 更新，顯示 bundle 版本
          setVersionInfo(`${nativeVersion} - Bundle: ${BUNDLE_BUILD}`);
        } else {
          // 沒有 CodePush 更新，只顯示 Native 版本
          setVersionInfo(`${nativeVersion} (${buildNumber})`);
        }
      } catch (error) {
        console.log('Failed to get CodePush metadata:', error);
        setVersionInfo(`${nativeVersion} (${buildNumber})`);
      }
    };

    loadVersionInfo();
  }, []);

  const renderProfileItem = ({ item }) => {
    const { label, key, getValue, isAction } = item || {};

    // 如果是刪除帳號按鈕
    if (isAction && key === 'deactivate') {
      return (
        <TouchableOpacity
          style={styles.profileItem}
          onPress={handleDeactivateAccount}
        >
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      );
    }

    let value: string;
    if (key === 'version') {
      value = versionInfo;
    } else if (getValue) {
      value = getValue();
    } else {
      value = profile?.[key] || '-';
    }

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
              initialParams={{ id: profile.id, showId: true }}
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
              initialParams={{ id: profile.id }}
              options={{
                tabBarLabel: '核銷紀錄',
              }}
            />
          </Tab.Navigator>

          {/* 刪除帳號和登出按鈕 */}
          <View style={styles.buttonContainer}>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>v{versionInfo}</Text>
            </View>
            <MyButton
              title="刪除帳號"
              isActive
              onPress={handleDeactivateAccount}
            />
            <View style={styles.buttonSpacer} />
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
  buttonSpacer: {
    height: 6,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    color: '#8E8E93',
  },
  deleteButtonWrapper: {
    width: 80,
  },
  headerRightButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;
