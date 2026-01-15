import React, { useEffect, useState } from 'react';
import { StatusBar, Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
import { Colors } from 'src/theme';
import { GluestackUIProvider } from 'src/components/ui/gluestack-ui-provider';

function App() {
  const [downloadProgress, setDownloadProgress] = useState<{
    receivedBytes: number;
    totalBytes: number;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
          title: "更新可用",
          optionalUpdateMessage: "發現新版本，是否立即更新？",
          optionalInstallButtonLabel: "立即更新",
          optionalIgnoreButtonLabel: "稍後",
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

        // 顯示下載進度條
        if (status === CodePush.SyncStatus.DOWNLOADING_PACKAGE) {
          setIsDownloading(true);
        } else if (
          status === CodePush.SyncStatus.UPDATE_INSTALLED ||
          status === CodePush.SyncStatus.UP_TO_DATE ||
          status === CodePush.SyncStatus.UPDATE_IGNORED ||
          status === CodePush.SyncStatus.UNKNOWN_ERROR
        ) {
          setIsDownloading(false);
          setDownloadProgress(null);
        }
      },
      (progress) => {
        console.log(`📊 Download progress: ${progress.receivedBytes} of ${progress.totalBytes} bytes`);
        setDownloadProgress({
          receivedBytes: progress.receivedBytes,
          totalBytes: progress.totalBytes,
        });
      }
    );

    // 初始化 Push Notifications
    const initPushNotifications = async () => {
      // 設置通知監聽器
      pushNotificationService.setupNotificationListeners();
    };

    initPushNotifications();
  }, []);

  const progressPercentage = downloadProgress
    ? Math.round((downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100)
    : 0;

  return (
    <GluestackUIProvider>
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

              {/* CodePush 下載進度 Modal */}
              <Modal
                visible={isDownloading}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                  // 防止使用者關閉 Modal
                }}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
                    <Text style={styles.title}>正在下載更新</Text>
                    <Text style={styles.warning}>⚠️ 下載期間請勿關閉 App</Text>

                    {/* 進度條 */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${progressPercentage}%` }
                        ]}
                      />
                    </View>

                    {/* 進度百分比和大小 */}
                    <Text style={styles.progressText}>
                      {progressPercentage}%
                    </Text>
                    {downloadProgress && (
                      <Text style={styles.sizeText}>
                        {(downloadProgress.receivedBytes / 1024 / 1024).toFixed(2)} MB / {(downloadProgress.totalBytes / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </View>
                </View>
              </Modal>
            </SafeAreaProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </GluestackUIProvider>
  );
}

// 樣式定義
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  sizeText: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
  },
});

// 使用 CodePush 包裝 App
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

export default CodePush(codePushOptions)(App);
