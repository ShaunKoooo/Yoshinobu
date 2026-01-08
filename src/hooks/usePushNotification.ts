import { useEffect, useCallback } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform, NativeModules } from 'react-native';
import { meApi } from '../services/api/me.api';
import { pushNotificationService } from '../services/pushNotification.service';
import { getDeviceData } from '../utils/device';
import { useAppSelector } from '../store/hooks';

const { APNsModule } = NativeModules;

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
            console.log('🚀 [initPushNotification] Starting initialization...');

            // 1. Request permission
            const { enabled, statusString } = await requestUserPermission();
            console.log('🔒 [initPushNotification] Permission status:', { enabled, statusString });

            if (enabled) {
                // 2. Get Fcm Token
                // For iOS, use APNs token directly as backend (rpush) uses APNs
                // For Android, use FCM token
                let pushToken: string | null = null;

                if (Platform.OS === 'ios') {
                    console.log('📱 [iOS] Checking for APNsModule...');
                    console.log('📱 [iOS] APNsModule exists:', !!APNsModule);
                    console.log('📱 [iOS] Available NativeModules:', Object.keys(NativeModules).filter(k => k.includes('APN') || k.includes('Push')));

                    // Get APNs token directly from native module
                    if (!APNsModule) {
                        console.error('❌ APNsModule not found! Make sure the native module is properly linked.');
                        console.log('All available modules:', Object.keys(NativeModules).sort().join(', '));
                    } else {
                        console.log('✅ [iOS] APNsModule found, calling getAPNSToken...');
                        try {
                            const apnsToken = await APNsModule.getAPNSToken();
                            console.log('📱 [iOS] APNs Token result:', {
                                token: apnsToken,
                                length: apnsToken?.length,
                                type: typeof apnsToken,
                                isNull: apnsToken === null,
                                isUndefined: apnsToken === undefined
                            });

                            if (apnsToken) {
                                // Native module returns properly formatted 64-char hex string
                                pushToken = apnsToken.toLowerCase();
                                console.log('✅ [iOS] Push token set:', pushToken);
                            } else {
                                console.error('❌ [iOS] APNs token is null - device may not be registered yet');
                                console.log('💡 [iOS] This usually means:');
                                console.log('   1. App just installed and APNs hasn\'t registered yet');
                                console.log('   2. Running on simulator (APNs doesn\'t work on simulator)');
                                console.log('   3. Device token callback in AppDelegate hasn\'t fired yet');
                            }
                        } catch (error) {
                            console.error('❌ [iOS] Error calling getAPNSToken:', error);
                        }
                    }
                } else {
                    // Get FCM token for Android
                    console.log('📱 [Android] Getting FCM token...');
                    pushToken = await messaging().getToken();
                    console.log('📱 [Android] FCM Token:', pushToken);
                }

                console.log('📱 [Final] Push token result:', pushToken);
                if (pushToken) {
                    console.log('✅ [Final] Updating device token...');
                    await updateDeviceToken(pushToken, statusString);
                } else {
                    console.error('❌ [Final] Failed to get push token');
                    console.log('💡 [Tip] If on iOS simulator, APNs tokens are not available. Test on a real device.');
                }
            } else {
                console.log('⚠️ [initPushNotification] Notifications not enabled, skipping token fetch');
            }
        };

        if (token) {
            initPushNotification();
        }

        // 3. Listen to token refresh
        const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
            if (token) {
                console.log('🔄 Token refreshed');
                const authStatus = await messaging().hasPermission();
                let statusString = 'denied';
                if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) statusString = 'granted';
                else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) statusString = 'provisional';

                // For iOS, get APNs token on refresh too
                let pushToken: string | null = null;
                if (Platform.OS === 'ios') {
                    if (APNsModule) {
                        const apnsToken = await APNsModule.getAPNSToken();
                        console.log('🔄 iOS APNs Token refreshed from Native Module:', apnsToken, 'length:', apnsToken?.length);

                        if (apnsToken) {
                            pushToken = apnsToken.toLowerCase();
                        }
                        console.log('🔄 iOS APNs Token refreshed (final):', pushToken);
                    }
                } else {
                    pushToken = newToken;
                    console.log('🔄 Android FCM Token refreshed:', pushToken);
                }

                if (pushToken) {
                    await updateDeviceToken(pushToken, statusString);
                }
            }
        });

        return unsubscribe;
    }, [updateDeviceToken, token]);
};
