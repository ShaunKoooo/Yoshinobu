import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from 'src/theme';
import { MyButton } from 'src/components';
import { authApi } from 'src/services/api/auth.api';

interface PhoneLoginFormProps {
  onLogin: (phone: string, verificationCode: string) => void;
}

const PhoneLoginForm = ({ onLogin }: PhoneLoginFormProps) => {
  const [countryCode, setCountryCode] = useState('+886');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (isSending) return;

    try {
      setIsSending(true);
      const mobile = `${countryCode}${phone}`;
      console.log('發送驗證碼到手機:', mobile);

      const result = await authApi.sendVerificationCode(mobile);

      if (result.ok) {
        Alert.alert('成功', '驗證碼已發送');
        setCodeSent(true);
        setCountdown(60);
      }
    } catch (error: any) {
      console.error('發送驗證碼失敗:', error);
      Alert.alert('發送失敗', error.message || '請稍後再試');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogin = () => {
    const mobile = `${countryCode}${phone}`;
    onLogin(mobile, verificationCode);
  };

  const isPhoneComplete = phone.length >= 10;

  return (
    <>
      {/* 登入標題 */}
      <Text style={styles.title}>手機號碼登入</Text>

      {/* 登入表單 */}
      <View style={styles.formContainer}>
        {/* 國碼選擇 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.countryCodeButton}>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 手機號碼輸入 */}
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <TextInput
              style={styles.input}
              placeholder="請輸入手機號碼"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 驗證碼輸入 */}
        <View style={styles.verificationCodeContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 0, height: 40 }]}>
            <TextInput
              style={styles.input}
              placeholder="請輸入驗證碼"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={8}
            />
          </View>
          <View style={styles.codeButtonContainer}>
            {codeSent && countdown > 0 ? (
              <Text style={styles.countdownText}>重新獲取驗證碼({countdown}s)</Text>
            ) : codeSent ? (
              <TouchableOpacity onPress={handleSendCode}>
                <Text style={styles.resendText}>重新獲取驗證碼</Text>
              </TouchableOpacity>
            ) : null}
            {/* 獲取驗證碼按鈕 - 只在手機號碼完整且尚未發送時顯示 */}
            {isPhoneComplete && !codeSent && (
              <TouchableOpacity
                style={styles.sendCodeButton}
                onPress={handleSendCode}
              >
                <Text style={styles.sendCodeText}>獲取驗證碼</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 提示文字 */}
        <Text style={styles.infoText}>未註冊的手機號驗證後會自動創建帳戶</Text>

        {/* 登入按鈕 */}
        <MyButton
          isActive={!!phone && !!verificationCode}
          title="登入"
          onPress={handleLogin}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingVertical: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 10,
    marginRight: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  sendCodeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendCodeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  codeButtonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 12,
    padding: 7,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 12,
  },
  resendText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 12,
    padding: 7,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
});

export default PhoneLoginForm;
