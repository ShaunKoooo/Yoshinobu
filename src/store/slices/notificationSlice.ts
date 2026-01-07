import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '../../services/api/notification.api';
import { Notification } from '../../services/api/types';

interface NotificationState {
    notifications: Notification[];
    newestTimestamp?: string;
    oldestTimestamp?: string;
    endReached: boolean;
    refreshing: boolean;
    loading: boolean;
    loadMoreing: boolean;
    error?: string;
}

const initialState: NotificationState = {
    notifications: [],
    endReached: false,
    refreshing: false,
    loading: false,
    loadMoreing: false,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
    'notification/fetch',
    async ({ newer = false, older = false }: { newer?: boolean; older?: boolean }, { getState, rejectWithValue }) => {
        try {
            const state = (getState() as any).notification as NotificationState;

            // Legacy Logic matching
            // before: older ? oldestTimestamp : null
            // after: newer ? newestTimestamp : null (implied refresh)

            // Note: ApiClient currently filters 'undefined', so we use 'null' to ensure key sends if needed
            // However, URLSearchParams converts null to "null". 
            // If the backend strictly needs the key `before` to be present (even if empty), we might need to handle that.
            // For now, mirroring legacy exactly:

            const params: any = {
                before: older ? state.oldestTimestamp : undefined,
                after: newer ? state.newestTimestamp : undefined,
            };

            // Initial Load Hack: If we invoke 'newer' (refresh) but have no data, 
            // treat it as loading latest history => before = now
            if (newer && !state.newestTimestamp) {
                params.before = new Date().toISOString();
                params.after = undefined;
            }

            const notifications = await notificationApi.getNotifications(params);
            return { notifications, older, newer };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markRead = createAsyncThunk(
    'notification/markRead',
    async (ids: number[], { rejectWithValue }) => {
        try {
            await notificationApi.setRead(ids);
            return ids;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAllRead = createAsyncThunk(
    'notification/markAllRead',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = (getState() as any).notification as NotificationState;
            const ids = state.notifications.filter(n => !n.read).map(n => n.id);
            if (ids.length === 0) return [];

            await notificationApi.setRead(ids);
            return ids;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // Optimistic Update can be triggered here if needed before API calls
        setNotificationsRead: (state, action: PayloadAction<number[]>) => {
            state.notifications.forEach(n => {
                if (action.payload.includes(n.id)) {
                    n.read = true;
                }
            });
        }
    },
    extraReducers: (builder) => {
        // Fetch Notifications
        builder.addCase(fetchNotifications.pending, (state, action) => {
            const { newer, older } = action.meta.arg;
            if (newer) state.refreshing = true;
            else if (older) state.loadMoreing = true;
            else state.loading = true;
            state.error = undefined;
        });
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            const { notifications: newNotifications, older } = action.payload;

            state.refreshing = false;
            state.loading = false;
            state.loadMoreing = false;

            if (older && newNotifications.length === 0) {
                state.endReached = true;
            }

            // Merge unique notifications
            const existingIds = new Set(state.notifications.map(n => n.id));
            const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
            const combined: Notification[] = [...uniqueNew, ...state.notifications];

            // Sort desc by id (assuming higher ID = newer)
            state.notifications = combined.sort((a, b) => b.id - a.id);

            state.newestTimestamp = state.notifications.length > 0 ? state.notifications[0].created_at : undefined;
            state.oldestTimestamp = state.notifications.length > 0 ? state.notifications[state.notifications.length - 1].created_at : undefined;
        });
        builder.addCase(fetchNotifications.rejected, (state, action) => {
            state.refreshing = false;
            state.loading = false;
            state.loadMoreing = false;
            state.error = action.payload as string;
        });

        // Mark Read
        builder.addCase(markRead.pending, (state, action) => {
            // Optimistic update
            const ids = action.meta.arg;
            state.notifications.forEach(n => {
                if (ids.includes(n.id)) n.read = true;
            });
        });

        // Mark All Read
        builder.addCase(markAllRead.pending, (state) => {
            state.notifications.forEach(n => n.read = true);
        });
    }
});

export const { setNotificationsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
