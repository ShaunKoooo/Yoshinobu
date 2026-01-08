import { NativeModules, Platform } from 'react-native';

/**
 * Debug utility to check APNs module status
 */
export const debugAPNsModule = () => {
  console.log('🔍 === APNs Module Debug Info ===');
  console.log('Platform:', Platform.OS);
  console.log('Available NativeModules:', Object.keys(NativeModules).sort());

  const { APNsModule } = NativeModules;

  if (APNsModule) {
    console.log('✅ APNsModule found!');
    console.log('APNsModule methods:', Object.keys(APNsModule));

    // Try to get token
    APNsModule.getAPNSToken()
      .then((token: string | null) => {
        if (token) {
          console.log('✅ APNs Token:', token);
          console.log('Token length:', token.length);
        } else {
          console.log('⚠️ APNs Token is null (not registered yet)');
        }
      })
      .catch((error: Error) => {
        console.error('❌ Error getting APNs token:', error);
      });
  } else {
    console.error('❌ APNsModule NOT found!');
    console.log('Searching for similar modules...');
    const similarModules = Object.keys(NativeModules).filter(name =>
      name.toLowerCase().includes('apn') ||
      name.toLowerCase().includes('push') ||
      name.toLowerCase().includes('notification')
    );
    console.log('Similar modules:', similarModules);
  }

  console.log('🔍 === End Debug Info ===');
};
