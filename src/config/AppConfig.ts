import { NativeModules, Platform } from 'react-native';
import Config from 'react-native-config';

interface AppConfigType {
  APP_TYPE: 'spa' | 'bb';
  APP_NAME: string;
  APP_DISPLAY_NAME: string;
  API_URL: string;
}

const getAppConfig = (): AppConfigType => {
  // iOS 使用 react-native-config (正常運作)
  if (Platform.OS === 'ios') {
    return {
      APP_TYPE: Config.APP_TYPE as 'spa' | 'bb',
      APP_NAME: Config.APP_NAME,
      APP_DISPLAY_NAME: Config.APP_DISPLAY_NAME,
      API_URL: Config.API_URL,
    };
  }

  // Android 使用我們自己的 Native Module
  const { AppConfig: AndroidConfig } = NativeModules;

  if (AndroidConfig) {
    return {
      APP_TYPE: AndroidConfig.APP_TYPE,
      APP_NAME: AndroidConfig.APP_NAME,
      APP_DISPLAY_NAME: AndroidConfig.APP_DISPLAY_NAME,
      API_URL: AndroidConfig.API_URL,
    };
  }

  // Fallback: 如果都失敗，使用預設值
  console.warn('AppConfig not available, using defaults');
  return {
    APP_TYPE: 'spa',
    APP_NAME: 'SPAApp',
    APP_DISPLAY_NAME: 'SPA 人體工房',
    API_URL: 'https://api.spa.com',
  };
};

export const AppConfig = getAppConfig();
