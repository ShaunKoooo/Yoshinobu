declare module 'react-native-config' {
  export interface NativeConfig {
    APP_TYPE: 'user' | 'client';
    APP_NAME: string;
    APP_DISPLAY_NAME: string;
    API_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
