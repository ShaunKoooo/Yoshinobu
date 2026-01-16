import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors } from 'src/theme';
import DeviceInfo from 'react-native-device-info';
import CodePush from '@code-push-next/react-native-code-push';
import { BUNDLE_BUILD } from 'src/constants/version';
import { AppConfig } from 'src/config/AppConfig';

const LoginFooter = () => {
  const [versionInfo, setVersionInfo] = React.useState('');

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

  const handlePrivacyPolicyPress = () => {
    const privacyUrl = AppConfig.APP_TYPE === 'bb'
      ? 'https://www.powerwindhealth.com.tw/buddybodyworkshop/tw'
      : 'https://www.fitnessfactory.com.tw/tw/privacy';

    Linking.openURL(privacyUrl).catch(err =>
      console.error('Failed to open privacy policy URL:', err)
    );
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerTextContainer}>
        {/* <TouchableOpacity>
          <Text style={styles.footerLink}>使用者條款(EULA)</Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.footerText}>與</Text> */}
        <TouchableOpacity onPress={handlePrivacyPolicyPress}>
          <Text style={styles.footerLink}>隱私權政策</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerVersionContainer}>
        <Text style={styles.footerVersion}>版本資訊：{versionInfo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 40,
  },
  footerTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 12,
  },
  footerVersionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  updateButton: {
    marginLeft: 10,
  },
  updateText: {
    color: Colors.primary,
  },
});

export default LoginFooter;
