declare module 'react-native' {
  interface NativeModulesStatic {
    APNsModule: {
      /**
       * Get the APNs device token from native iOS
       * @returns Promise resolving to the 64-character hex string APNs token, or null if not available
       */
      getAPNSToken(): Promise<string | null>;
    };
  }
}
