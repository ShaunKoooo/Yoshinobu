import { Platform } from 'react-native';

export const uploadService = {
    /**
     * Uploads a file to Google Cloud Storage using a signed URL.
     * @param signedUrl The signed URL provided by the backend.
     * @param fileUri The local URI of the file to upload.
     * @param contentType The MIME type of the file.
     */
    uploadToGCS: async (signedUrl: string, fileUri: string, contentType: string = 'image/jpeg'): Promise<void> => {
        try {
            // Fetch the file locally to get a Blob
            const response = await fetch(fileUri);
            const blob = await response.blob();

            // Upload to GCS
            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                body: blob,
                headers: {
                    'Content-Type': contentType,
                },
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`GCS Upload Failed: ${uploadResponse.status} ${errorText}`);
            }
        } catch (error) {
            console.error('Upload Service Error:', error);
            throw error;
        }
    },
};
