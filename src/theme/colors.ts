import { AppConfig } from 'src/config/AppConfig';

// SPA App 主色
const SPA_COLORS = {
  primary: '#a48e7b',
  baseColor: '#333333',
  primaryDark: '#8a7563',
  primaryLight: '#b9a08f',
};

// BB App 主色（待定義）
const BB_COLORS = {
  primary: '#B49162',  // TODO: 更換為 BB App 的主色
  primaryDark: '#9a7a50',
  primaryLight: '#c9a77b',
};

// 根據當前 App 選擇顏色主題
const getThemeColors = () => {
  if (AppConfig.APP_TYPE === 'spa') {
    return SPA_COLORS;
  } else {
    return BB_COLORS;
  }
};

export const Colors = {
  ...getThemeColors(),

  // 共用顏色
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F8F9FA',
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C9CDD4',
    500: '#A2A2A2',
    600: '#8F9BB3',
    700: '#4E5969',
    800: '#333333',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    placeholder: '#C9CDD4',
  },
  border: '#F2F2F7',
  background: '#F8F9FA',
};
