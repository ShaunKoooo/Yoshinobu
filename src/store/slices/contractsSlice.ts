import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractsApi } from '../../services/api/contracts.api';
import { uploadService } from '../../services/upload.service';
import { ContractMediaUploadInfo } from '../../services/api/types';
import dayjs from 'dayjs';

interface ContractsState {
    uploading: boolean;
    error?: string;
    lastUploadedMedia?: ContractMediaUploadInfo;
}

const initialState: ContractsState = {
    uploading: false,
};

// Async Thunk for Two-Stage Upload
export const uploadContractMedia = createAsyncThunk(
    'contracts/uploadMedia',
    async (
        { fileUri, extname, date }: { fileUri: string; extname: string; date?: string },
        { rejectWithValue }
    ) => {
        try {
            const targetDate = date || dayjs().format('YYYY-MM-DD');

            // 1. Get Upload Info (Signed URL)
            const uploadInfo = await contractsApi.getMediaUploadInfo({
                extname,
                date: targetDate,
            });

            if (!uploadInfo.url) {
                throw new Error('Failed to get upload URL');
            }

            // 2. Upload to GCS
            const contentType = extname === 'png' ? 'image/png' : 'image/jpeg';
            await uploadService.uploadToGCS(uploadInfo.url, fileUri, contentType);

            return uploadInfo;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Upload failed');
        }
    }
);

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        clearUploadState: (state) => {
            state.uploading = false;
            state.error = undefined;
            state.lastUploadedMedia = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadContractMedia.pending, (state) => {
                state.uploading = true;
                state.error = undefined;
            })
            .addCase(uploadContractMedia.fulfilled, (state, action) => {
                state.uploading = false;
                state.lastUploadedMedia = action.payload;
            })
            .addCase(uploadContractMedia.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUploadState } = contractsSlice.actions;
export default contractsSlice.reducer;
