import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, PermissionsAndroid } from 'react-native';

/**
 * Push Notification 服務
 * 處理 FCM token 和通知接收
 */
class PushNotificationService {
  /**
   * 請求通知權限並獲取 FCM token
   */
  async requestPermission(): Promise<string | null> {
    try {
      console.log('開始請求通知權限, Platform:', Platform.OS, 'Version:', Platform.Version);

      // Android 13+ 需要額外請求運行時權限
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('Android 13+, 請求 POST_NOTIFICATIONS 權限');

        // 先檢查是否已經有權限
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        console.log('當前權限狀態:', hasPermission);

        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: '通知權限',
              message: '允許接收重要的預約和課程通知',
              buttonPositive: '允許',
              buttonNegative: '拒絕',
            }
          );

          console.log('權限請求結果:', granted);

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Android 通知權限已授予');
          } else {
            console.log('Android 通知權限被拒絕, result:', granted);
            return null;
          }
        } else {
          console.log('Android 通知權限已存在');
        }
      }

      // iOS 或 Android (所有版本) 使用 Firebase Messaging 的權限請求
      console.log('請求 Firebase Messaging 授權');
      const authStatus = await messaging().requestPermission();
      console.log('Firebase Messaging 授權狀態:', authStatus);

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('通知權限已授予，狀態:', authStatus);
        return await this.getFCMToken();
      } else {
        console.log('通知權限被拒絕, authStatus:', authStatus);
        return null;
      }
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      return null;
    }
  }

  /**
   * 獲取 FCM Token
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('獲取 FCM Token 失敗:', error);
      return null;
    }
  }

  /**
   * 初始化通知監聽器
   */
  setupNotificationListeners() {
    // 監聽 Token 刷新
    messaging().onTokenRefresh((token) => {
      console.log('FCM Token 已刷新:', token);
      // TODO: 將新 token 發送到後端
    });

    // 前景通知（App 開啟時）
    messaging().onMessage(async (remoteMessage) => {
      console.log('收到前景通知:', remoteMessage);

      // 顯示 Alert
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || '通知',
          remoteMessage.notification.body || ''
        );
      }

      // TODO: 可以使用 react-native-push-notification 顯示本地通知
    });

    // 背景通知處理（App 在背景時收到通知）
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('收到背景通知:', remoteMessage);
      // 在背景處理通知邏輯
    });

    // 用戶點擊通知打開 App
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('用戶點擊通知打開 App:', remoteMessage);
      // TODO: 根據通知內容導航到特定頁面
      // 例如：navigation.navigate('NotificationDetail', { id: remoteMessage.data.id });
    });

    // App 從完全關閉狀態被通知打開
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App 從通知啟動:', remoteMessage);
          // TODO: 根據通知內容導航到特定頁面
        }
      });
  }

  /**
   * 訂閱主題（可選）
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`已訂閱主題: ${topic}`);
    } catch (error) {
      console.error(`訂閱主題失敗 (${topic}):`, error);
    }
  }

  /**
   * 取消訂閱主題（可選）
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`已取消訂閱主題: ${topic}`);
    } catch (error) {
      console.error(`取消訂閱主題失敗 (${topic}):`, error);
    }
  }

  /**
   * 檢查通知權限狀態
   */
  async checkPermission(): Promise<boolean> {
    const authStatus = await messaging().hasPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
}

export const pushNotificationService = new PushNotificationService();
