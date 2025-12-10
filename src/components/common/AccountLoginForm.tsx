import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MyButton } from 'src/components';

interface AccountLoginFormProps {
  onLogin: (account: string, password: string) => void;
  onForgotPassword?: () => void;
}

const AccountLoginForm = ({ onLogin, onForgotPassword }: AccountLoginFormProps) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(account, password);
  };

  return (
    <>
      {/* 登入標題 */}
      <Text style={styles.title}>帳號登入</Text>

      {/* 登入表單 */}
      <View style={styles.formContainer}>
        {/* 帳號輸入 */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="請輸入帳號"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
          />
        </View>

        {/* 密碼輸入 */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="請輸入密碼"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* 忘記密碼 */}
        {onForgotPassword && (
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={onForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>忘記密碼</Text>
          </TouchableOpacity>
        )}

        {/* 登入按鈕 */}
        <MyButton
          isActive={!!account && !!password}
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
  inputGroup: {
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default AccountLoginForm;
