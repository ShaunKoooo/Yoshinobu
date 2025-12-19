import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Visit, GetVisitsRequest } from 'src/services/api/types';

/**
 * Visits 狀態管理
 */
interface VisitsState {
  visits: Visit[];
  selectedVisit: Visit | null;
  filters: GetVisitsRequest;
  isLoading: boolean;
  error: string | null;
}

const initialState: VisitsState = {
  visits: [],
  selectedVisit: null,
  filters: {},
  isLoading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    setVisits: (state, action: PayloadAction<Visit[]>) => {
      state.visits = action.payload;
      state.error = null;
    },
    setSelectedVisit: (state, action: PayloadAction<Visit | null>) => {
      state.selectedVisit = action.payload;
    },
    setVisitsFilters: (state, action: PayloadAction<GetVisitsRequest>) => {
      state.filters = action.payload;
    },
    setVisitsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setVisitsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearVisits: (state) => {
      state.visits = [];
      state.selectedVisit = null;
      state.error = null;
      state.isLoading = false;
    },
    // 新增單個 visit（例如建立預約後）
    addVisit: (state, action: PayloadAction<Visit>) => {
      state.visits.unshift(action.payload);
    },
    // 更新單個 visit（例如取消預約後）
    updateVisit: (state, action: PayloadAction<Visit>) => {
      const index = state.visits.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.visits[index] = action.payload;
      }
      if (state.selectedVisit?.id === action.payload.id) {
        state.selectedVisit = action.payload;
      }
    },
    // 移除單個 visit
    removeVisit: (state, action: PayloadAction<number>) => {
      state.visits = state.visits.filter(v => v.id !== action.payload);
      if (state.selectedVisit?.id === action.payload) {
        state.selectedVisit = null;
      }
    },
  },
});

export const {
  setVisits,
  setSelectedVisit,
  setVisitsFilters,
  setVisitsLoading,
  setVisitsError,
  clearVisits,
  addVisit,
  updateVisit,
  removeVisit,
} = visitsSlice.actions;

export default visitsSlice.reducer;
