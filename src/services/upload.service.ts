export const uploadService = {
    /**
     * Uploads a file to Google Cloud Storage using a signed URL.
     * @param signedUrl The signed URL provided by the backend.
     * @param fileUri The local URI of the file to upload.
     * @param contentType The MIME type of the file.
     */
    uploadToGCS: async (signedUrl: string, fileUri: string, contentType: string = 'image/jpeg'): Promise<void> => {
        try {
            console.log('開始上傳檔案:', { fileUri, contentType, signedUrl: signedUrl.substring(0, 50) + '...' });

            // 方法1: 先讀取檔案為 blob，再上傳
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

            console.log('上傳成功, status:', uploadResponse.status);
        } catch (error: any) {
            console.error('Upload Service Error:', error);
            throw error;
        }
    },
};
