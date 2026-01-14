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
import { MyAlert } from 'src/components';

const { width, height } = Dimensions.get('window');
const isSPAApp = AppConfig.APP_TYPE === 'spa';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile } = useInitializeUser();
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // 進入頁面時檢查是否有姓名
  useEffect(() => {
    if (profile && (profile.name == 'undefined' || !profile.name)) {
      setShowNameAlert(true);
    }
  }, [profile]);

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
    setShowNameAlert(false);
    // TODO: 這裡將來會呼叫 API 更新姓名
    console.log('確認填寫姓名');
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
