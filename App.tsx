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
        console.log("Sync status:", status);
      },
      (progress) => {
        console.log(`Received ${progress.receivedBytes} of ${progress.totalBytes}`);
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

export default App;
