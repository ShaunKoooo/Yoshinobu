import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppConfig } from 'src/config/AppConfig';
import { Colors } from 'src/theme';
import { useNavigation } from '@react-navigation/native';
import { useInitializeUser } from 'src/hooks/useInitializeUser';
import { useUpdateClient, useClient } from 'src/services/hooks';
import { MyAlert } from 'src/components';

const { width, height } = Dimensions.get('window');
const isSPAApp = AppConfig.APP_TYPE === 'spa';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile, isLoading } = useInitializeUser();
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [hasCheckedName, setHasCheckedName] = useState(false);
  const { mutate: updateClient } = useUpdateClient();

  // 獲取完整的客戶資料
  const { data: clientData, isLoading: isClientLoading } = useClient(profile?.id || 0, !!profile?.id);
  // 進入頁面時檢查是否有姓名
  useEffect(() => {
    // 等待 profile 和 clientData 都載入完成後才檢查姓名，且只檢查一次
    if (!isLoading && !isClientLoading && !hasCheckedName && profile && clientData?.client) {
      // 先檢查姓名是否為空
      const shouldShowAlert = clientData.client.name === 'undefined' || !clientData.client.name;

      // 標記已檢查過
      setHasCheckedName(true);

      // 只有在需要時才顯示 Alert
      if (shouldShowAlert) {
        setShowNameAlert(true);
      }
    }
  }, [profile, clientData, isLoading, isClientLoading, hasCheckedName]);

  // 根據 APP_TYPE 選擇對應的圖片
  const backgroundImage = isSPAApp
    ? require('../../../assets/spa/home.png')
    : require('../../../assets/bb/home.png');

  const handleBooking = () => {
    // 檢查是否有姓名
    if (!profile?.name) {
      setShowNameAlert(true);
      return;
    }
    console.log('立即預約');
    navigation.navigate('CreateBooking');
  };

  const handleConfirmName = () => {
    // 檢查輸入框是否為空
    if (!nameInput.trim()) {
      return; // 輸入框為空時不允許關閉 Modal
    }

    // 檢查 profile 是否存在且有 id
    if (!profile?.id) {
      console.error('無法取得客戶 ID');
      return;
    }

    // 檢查是否有完整的客戶資料
    if (!clientData?.client) {
      console.error('無法取得完整客戶資料');
      return;
    }

    // 處理 gender 類型轉換，只允許 'male' 或 'female'
    let gender: 'male' | 'female' | undefined = undefined;
    if (clientData.client.gender === 'female') {
      gender = 'female';
    } else if (clientData.client.gender === 'male') {
      gender = 'male';
    }
    // 如果是 'other' 或其他值，gender 設為 undefined

    const updateData = {
      ...clientData.client,
      name: nameInput.trim(),
      gender, // 保證只會是 'male' | 'female' | undefined
    };

    console.log('準備更新的資料:', updateData);

    updateClient(
      {
        id: profile.id,
        data: updateData,
      },
      {
        onSuccess: () => {
          console.log('成功更新姓名:', nameInput);
          setShowNameAlert(false);
          setNameInput('');
        },
        onError: (error: any) => {
          console.error('更新姓名失敗:', error);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* 底部按鈕區域 */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBooking}
            activeOpacity={0.8}>
            <Text style={styles.bookingButtonText}>立即預約</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* 填寫姓名提醒 */}
      <MyAlert
        visible={showNameAlert}
        title="請填寫客戶姓名"
        message="填寫客戶姓名時，建議使用與身分證明文件一致的真實姓名，以確保驗證和服務使用的準確性"
        onConfirm={handleConfirmName}
        confirmText="確認"
        customContent={
          <TextInput
            style={nameInputStyles.input}
            placeholder="真實姓名"
            placeholderTextColor="#C9CDD4"
            value={nameInput}
            onChangeText={setNameInput}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bookingButton: {
    backgroundColor: Colors.primary, // #8B7B6E with opacity
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

const nameInputStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000000',
  },
});

export default HomeScreen;
