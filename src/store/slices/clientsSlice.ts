import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Client } from 'src/services/api/types';

/**
 * Clients 狀態管理
 */
interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  selectedClient: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.error = null;
    },
    setSelectedClient: (state, action: PayloadAction<Client | null>) => {
      state.selectedClient = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setClientsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearClients: (state) => {
      state.clients = [];
      state.selectedClient = null;
      state.searchQuery = '';
      state.error = null;
      state.isLoading = false;
    },
    // 新增單個 client（例如建立客戶後）
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.unshift(action.payload);
    },
    // 更新單個 client
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(c => c.client.id === action.payload.client.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
      if (state.selectedClient?.client.id === action.payload.client.id) {
        state.selectedClient = action.payload;
      }
    },
    // 移除單個 client
    removeClient: (state, action: PayloadAction<number>) => {
      state.clients = state.clients.filter(c => c.client.id !== action.payload);
      if (state.selectedClient?.client.id === action.payload) {
        state.selectedClient = null;
      }
    },
  },
});

export const {
  setClients,
  setSelectedClient,
  setSearchQuery,
  setClientsLoading,
  setClientsError,
  clearClients,
  addClient,
  updateClient,
  removeClient,
} = clientsSlice.actions;

export default clientsSlice.reducer;
