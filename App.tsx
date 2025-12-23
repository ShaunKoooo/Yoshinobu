import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from 'src/store';
import { AuthProvider } from 'src/contexts/AuthContext';
import RootNavigator from 'src/navigation/RootNavigator';
import CodePush from "@code-push-next/react-native-code-push";
import { queryClient } from 'src/services/queryClient';
import { pushNotificationService } from 'src/services/pushNotification.service';

function App() {
  useEffect(() => {
    // 獲取當前 CodePush 資訊
    CodePush.getUpdateMetadata().then((metadata) => {
      if (metadata) {
        console.log("📦 Current CodePush version:", metadata.label, "| App version:", metadata.appVersion);
      } else {
        console.log("📦 No CodePush update installed yet");
      }
    });

    // CodePush 同步
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
          title: "Update Available",
          optionalUpdateMessage: "There is a new version. Do you want to update?",
          optionalInstallButtonLabel: "Yes",
          optionalIgnoreButtonLabel: "Later",
        },
      },
      (status) => {
        const statusMessages = {
          [CodePush.SyncStatus.UP_TO_DATE]: "✅ App is up to date",
          [CodePush.SyncStatus.UPDATE_INSTALLED]: "✅ Update installed, will apply on restart",
          [CodePush.SyncStatus.UPDATE_IGNORED]: "⚠️ Update ignored",
          [CodePush.SyncStatus.UNKNOWN_ERROR]: "❌ Unknown error",
          [CodePush.SyncStatus.SYNC_IN_PROGRESS]: "🔄 Sync in progress",
          [CodePush.SyncStatus.CHECKING_FOR_UPDATE]: "🔍 Checking for update",
          [CodePush.SyncStatus.AWAITING_USER_ACTION]: "⏳ Awaiting user action",
          [CodePush.SyncStatus.DOWNLOADING_PACKAGE]: "⬇️ Downloading package",
          [CodePush.SyncStatus.INSTALLING_UPDATE]: "📥 Installing update",
        };
        console.log("CodePush Status:", statusMessages[status] || `Unknown status: ${status}`);
      },
      (progress) => {
        console.log(`📊 Download progress: ${progress.receivedBytes} of ${progress.totalBytes} bytes`);
      }
    );

    // 初始化 Push Notifications
    const initPushNotifications = async () => {
      // 設置通知監聽器
      pushNotificationService.setupNotificationListeners();

      // 請求通知權限並獲取 FCM token
      const token = await pushNotificationService.requestPermission();
      if (token) {
        console.log('FCM Token:', token);
        // TODO: token 發送到後端服務器
      }
    };

    initPushNotifications();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor="#000000"
              translucent={false}
            />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

// 使用 CodePush 包裝 App
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

export default CodePush(codePushOptions)(App);
