import { useEffect, useCallback } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { meApi } from '../services/api/me.api';
import { pushNotificationService } from '../services/pushNotification.service';
import { getDeviceData } from '../utils/device';
import { useAppSelector } from '../store/hooks';

export const usePushNotification = () => {
    const { token } = useAppSelector((state) => state.auth);

    const updateDeviceToken = useCallback(async (fcmToken: string, permissionStatus: string) => {
        try {
            if (!token) {
                console.log('❌ UpdateDevice - No auth token available, skipping update');
                return;
            }

            console.log('📱 Getting device data for token:', fcmToken, 'status:', permissionStatus);
            const deviceData = await getDeviceData(fcmToken, permissionStatus);

            console.log('🚀 Uploading device data:', deviceData);
            const response = await meApi.updateDevice(deviceData);

            console.log('✅ Device update response:', response);
        } catch (error) {
            console.error('❌ Failed to update device token:', error);
        }
    }, [token]);

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.log('🔒 Authorization status:', authStatus, 'Enabled:', enabled);

        let statusString = 'denied';
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) statusString = 'granted';
        else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) statusString = 'provisional';
        else if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) statusString = 'not_determined';

        return { enabled, statusString };
    };

    useEffect(() => {
        // Setup listeners (foreground, background tap, quit tap)
        pushNotificationService.setupNotificationListeners(
            (notification) => {
                console.log('🔔 Foreground Notification:', notification);
            },
            (notification) => {
                console.log('🔔 Notification Opened:', notification);
                // Implementation for navigation would go here
                // e.g. navigationRef.navigate('Detail', { id: notification.data.id });
            }
        );

        const initPushNotification = async () => {
            // 1. Request permission
            const { enabled, statusString } = await requestUserPermission();

            if (enabled) {
                // 2. Get Fcm Token
                try {
                    const fcmToken = await messaging().getToken();
                    if (fcmToken) {
                        await updateDeviceToken(fcmToken, statusString);
                    }
                } catch (error) {
                    console.error('❌ Failed to get FCM token:', error);
                }
            }
        };

        if (token) {
            initPushNotification();
        }

        // 3. Listen to token refresh
        const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
            if (token) {
                console.log('🔄 Token refreshed:', fcmToken);
                // Refresh logic assumes 'granted' if we are here, or we could re-check permission, 
                // but usually refresh happens when authorized. We'll check current permission to be safe.
                const authStatus = await messaging().hasPermission();
                let statusString = 'denied';
                if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) statusString = 'granted';
                else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) statusString = 'provisional';

                await updateDeviceToken(fcmToken, statusString);
            }
        });

        return unsubscribe;
    }, [updateDeviceToken, token]);
};
