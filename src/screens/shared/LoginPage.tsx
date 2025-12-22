import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  AccountLoginForm,
  LoginFooter,
  PhoneLoginForm,
} from 'src/components';
import { AppConfig } from 'src/config/AppConfig';
import { useAppDispatch } from 'src/store/hooks';
import { loginWithAccount, loginWithPhone } from 'src/store/slices/authSlice';

const isSPAApp = AppConfig.APP_TYPE === 'spa';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');

  const handleForgotPassword = () => {
    // TODO: 導航到忘記密碼頁面
    console.log('忘記密碼');
  };

  const toggleLoginType = () => {
    setLoginType(prev => prev === 'account' ? 'phone' : 'account');
  };

  const handleLogin = async (account: string, password: string) => {
    try {
      const result = await dispatch(loginWithAccount({ account, password })).unwrap();
      console.log('登入成功:', result);
    } catch (error: any) {
      console.error('登入失敗:', error);
      Alert.alert('登入失敗', error || '請稍後再試');
    }
  };

  const handlePhoneLogin = async (phone: string, verificationCode: string) => {
    try {
      const result = await dispatch(loginWithPhone({ phone, verificationCode })).unwrap();
      console.log('登入成功:', result);
    } catch (error: any) {
      console.error('登入失敗:', error);
      Alert.alert('登入失敗', error || '請稍後再試');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo 圖片 */}
        <View style={styles.logoContainer}>
          <Image
            source={isSPAApp ? require('../../../assets/spa/spa_login.png') : require('../../../assets/bb/bb_login.png')}
            style={styles.logoImage}
          />
        </View>

        {/* 登入表單 */}
        {loginType === 'account' ? (
          <AccountLoginForm
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        ) : (
          <PhoneLoginForm onLogin={handlePhoneLogin} />
        )}

        {/* 切換登入方式按鈕 */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={toggleLoginType}
        >
          <Text style={styles.switchButtonText}>
            {loginType === 'account' ? '使用者登入' : '專家登入'}
          </Text>
        </TouchableOpacity>

        {/* 底部文字 */}
        <LoginFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 36,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  // Logo
  logoContainer: {
    // alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 243,
    height: 117,
  },
  // 切換按鈕
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginPage;