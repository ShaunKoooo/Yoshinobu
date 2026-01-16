// @ts-ignore - Platform exists in RN but types may be outdated
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const uploadService = {
    /**
     * Uploads a file to Google Cloud Storage using a signed URL.
     * @param signedUrl The signed URL provided by the backend.
     * @param fileUri The local URI of the file to upload.
     * @param contentType The MIME type of the file.
     */
    uploadToGCS: async (signedUrl: string, fileUri: string, contentType: string = 'image/jpeg'): Promise<void> => {
        try {
            console.log('開始上傳檔案:', { fileUri, contentType, platform: Platform.OS });

            if (Platform.OS === 'android') {
                // Android: 使用 react-native-blob-util 直接上傳
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
            } else {
                // iOS: 使用 fetch 讀取檔案
                console.log('使用 iOS 檔案讀取方式');
                const fileResponse = await fetch(fileUri);
                const blob = await fileResponse.blob();
                console.log('檔案讀取成功，大小:', blob.size, 'bytes');

                // 上傳到 GCS
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
            }
        } catch (error: any) {
            console.error('❌ Upload Service Error:', error);
            throw error;
        }
    },
};
