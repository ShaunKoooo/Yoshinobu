/**
 * Safe Upload Service with fallback for blob-util issues
 *
 * This service provides a safe wrapper around react-native-blob-util
 * to prevent NativeEventEmitter crashes when the native module is not ready.
 */

// @ts-ignore - Platform exists in RN but types may be outdated
import { Platform } from 'react-native';

// Lazy import to catch initialization errors
let ReactNativeBlobUtil: any = null;
let blobUtilAvailable = false;
let initializationError: Error | null = null;

/**
 * Initialize react-native-blob-util safely
 */
const initializeBlobUtil = () => {
  if (ReactNativeBlobUtil !== null || initializationError !== null) {
    return; // Already initialized or failed
  }

  try {
    ReactNativeBlobUtil = require('react-native-blob-util').default;

    // Test if the native module is actually available
    if (!ReactNativeBlobUtil || typeof ReactNativeBlobUtil.fetch !== 'function') {
      throw new Error('react-native-blob-util native module not available');
    }

    blobUtilAvailable = true;
    console.log('✅ [UploadService] react-native-blob-util initialized successfully');
  } catch (error: any) {
    console.error('❌ [UploadService] Failed to initialize react-native-blob-util:', error);
    initializationError = error;
    blobUtilAvailable = false;
  }
};

/**
 * Upload file for iOS using fetch API (doesn't require native modules)
 */
const uploadIOS = async (signedUrl: string, fileUri: string, contentType: string): Promise<void> => {
  console.log('使用 iOS fetch 上傳方式');

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();
  console.log('檔案讀取成功，大小:', blob.size, 'bytes');

  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: blob,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error('GCS 上傳失敗:', uploadResponse.status, errorText);
    throw new Error(`GCS Upload Failed: ${uploadResponse.status} ${errorText}`);
  }

  console.log('✅ iOS 上傳成功, status:', uploadResponse.status);
};

/**
 * Upload file for Android using react-native-blob-util
 */
const uploadAndroid = async (signedUrl: string, fileUri: string, contentType: string): Promise<void> => {
  // Try to initialize blob-util if not already done
  if (!blobUtilAvailable && !initializationError) {
    initializeBlobUtil();
  }

  // If blob-util is not available, fall back to fetch
  if (!blobUtilAvailable || !ReactNativeBlobUtil) {
    console.warn('⚠️ [UploadService] react-native-blob-util not available, using fetch fallback');
    return uploadWithFetchFallback(signedUrl, fileUri, contentType);
  }

  console.log('使用 Android blob-util 上傳方式');

  // 移除 file:// 前綴
  const filePath = fileUri.replace('file://', '');
  console.log('檔案路徑:', filePath);

  const response = await ReactNativeBlobUtil.fetch(
    'PUT',
    signedUrl,
    {
      'Content-Type': contentType,
    },
    ReactNativeBlobUtil.wrap(filePath)
  );

  console.log('上傳回應狀態:', response.info().status);

  if (response.info().status !== 200) {
    const errorText = response.text();
    console.error('GCS 上傳失敗:', response.info().status, errorText);
    throw new Error(`GCS Upload Failed: ${response.info().status}`);
  }

  console.log('✅ Android 上傳成功');
};

/**
 * Fallback upload method using fetch API (works on both platforms)
 * This doesn't require any native modules
 */
const uploadWithFetchFallback = async (signedUrl: string, fileUri: string, contentType: string): Promise<void> => {
  console.log('使用 Fetch API 備用上傳方式');

  try {
    // For Android, we need to handle file:// URIs
    let finalUri = fileUri;
    if (Platform.OS === 'android' && !fileUri.startsWith('http')) {
      // Try to read the file using fetch
      finalUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;
    }

    const fileResponse = await fetch(finalUri);

    if (!fileResponse.ok) {
      throw new Error(`Failed to read file: ${fileResponse.status}`);
    }

    const blob = await fileResponse.blob();
    console.log('檔案讀取成功，大小:', blob.size, 'bytes');

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('GCS 上傳失敗:', uploadResponse.status, errorText);
      throw new Error(`GCS Upload Failed: ${uploadResponse.status} ${errorText}`);
    }

    console.log('✅ Fetch 備用上傳成功, status:', uploadResponse.status);
  } catch (error: any) {
    console.error('❌ Fetch fallback upload error:', error);
    throw error;
  }
};

export const uploadService = {
  /**
   * Uploads a file to Google Cloud Storage using a signed URL.
   * Safely handles react-native-blob-util initialization issues.
   *
   * @param signedUrl The signed URL provided by the backend.
   * @param fileUri The local URI of the file to upload.
   * @param contentType The MIME type of the file.
   */
  uploadToGCS: async (signedUrl: string, fileUri: string, contentType: string = 'image/jpeg'): Promise<void> => {
    try {
      console.log('開始上傳檔案:', { fileUri, contentType, platform: Platform.OS });

      if (Platform.OS === 'ios') {
        // iOS: Always use fetch (more reliable, doesn't need native modules)
        await uploadIOS(signedUrl, fileUri, contentType);
      } else {
        // Android: Try blob-util first, fallback to fetch if it fails
        await uploadAndroid(signedUrl, fileUri, contentType);
      }
    } catch (error: any) {
      console.error('❌ Upload Service Error:', error);

      // If the error is related to NativeEventEmitter, provide helpful message
      if (error?.message?.includes('NativeEventEmitter') ||
          error?.message?.includes('native module') ||
          error?.message?.includes('Invariant Violation')) {
        throw new Error('上傳功能需要重新啟動應用程式。請完全關閉應用程式後重新開啟。');
      }

      throw error;
    }
  },
};
