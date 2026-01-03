import reducer, {
  setClients,
  setSelectedClient,
  setSearchQuery,
  setClientsLoading,
  setClientsError,
  clearClients,
  addClient,
  updateClient,
  removeClient,
} from '../clientsSlice';
import type { Client } from 'src/services/api/types';

/**
 * clientsSlice 測試
 */
describe('clientsSlice', () => {
  // 測試用的假資料
  const mockClient1: Client = {
    client: {
      id: 1,
      name: '測試客戶1',
      email: 'test1@example.com',
      mobile: '0912345678',
      gender: 'male',
      birthday: '1990-01-01',
      address: '台北市',
      note: '測試備註',
    },
  };

  const mockClient2: Client = {
    client: {
      id: 2,
      name: '測試客戶2',
      email: 'test2@example.com',
      mobile: '0923456789',
      gender: 'female',
    },
  };

  const mockClient3: Client = {
    client: {
      id: 3,
      name: '測試客戶3',
      email: 'test3@example.com',
      mobile: '0934567890',
      gender: 'other',
    },
  };

  // 初始狀態
  const initialState = {
    clients: [],
    selectedClient: null,
    searchQuery: '',
    isLoading: false,
    error: null,
  };

  describe('初始狀態', () => {
    it('應該返回正確的初始狀態', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setClients', () => {
    it('應該設定客戶列表', () => {
      const clients = [mockClient1, mockClient2];
      const state = reducer(initialState, setClients(clients));

      expect(state.clients).toEqual(clients);
      expect(state.clients).toHaveLength(2);
    });

    it('應該清除錯誤訊息', () => {
      const stateWithError = {
        ...initialState,
        error: '發生錯誤',
      };
      const state = reducer(stateWithError, setClients([mockClient1]));

      expect(state.error).toBeNull();
    });

    it('應該能設定空陣列', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2],
      };
      const state = reducer(stateWithClients, setClients([]));

      expect(state.clients).toEqual([]);
      expect(state.clients).toHaveLength(0);
    });
  });

  describe('setSelectedClient', () => {
    it('應該設定選中的客戶', () => {
      const state = reducer(initialState, setSelectedClient(mockClient1));

      expect(state.selectedClient).toEqual(mockClient1);
    });

    it('應該能清除選中的客戶', () => {
      const stateWithSelected = {
        ...initialState,
        selectedClient: mockClient1,
      };
      const state = reducer(stateWithSelected, setSelectedClient(null));

      expect(state.selectedClient).toBeNull();
    });
  });

  describe('setSearchQuery', () => {
    it('應該設定搜尋關鍵字', () => {
      const state = reducer(initialState, setSearchQuery('測試'));

      expect(state.searchQuery).toBe('測試');
    });

    it('應該能清空搜尋關鍵字', () => {
      const stateWithQuery = {
        ...initialState,
        searchQuery: '測試',
      };
      const state = reducer(stateWithQuery, setSearchQuery(''));

      expect(state.searchQuery).toBe('');
    });
  });

  describe('setClientsLoading', () => {
    it('應該設定載入狀態為 true', () => {
      const state = reducer(initialState, setClientsLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it('應該設定載入狀態為 false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true,
      };
      const state = reducer(stateWithLoading, setClientsLoading(false));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('setClientsError', () => {
    it('應該設定錯誤訊息', () => {
      const errorMessage = '載入失敗';
      const state = reducer(initialState, setClientsError(errorMessage));

      expect(state.error).toBe(errorMessage);
    });

    it('應該將載入狀態設為 false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true,
      };
      const state = reducer(stateWithLoading, setClientsError('錯誤'));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('clearClients', () => {
    it('應該清除所有客戶相關資料', () => {
      const stateWithData = {
        clients: [mockClient1, mockClient2],
        selectedClient: mockClient1,
        searchQuery: '測試',
        isLoading: true,
        error: '錯誤訊息',
      };
      const state = reducer(stateWithData, clearClients());

      expect(state).toEqual(initialState);
    });
  });

  describe('addClient', () => {
    it('應該將新客戶加入列表開頭', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2],
      };
      const state = reducer(stateWithClients, addClient(mockClient3));

      expect(state.clients).toHaveLength(3);
      expect(state.clients[0]).toEqual(mockClient3);
      expect(state.clients[1]).toEqual(mockClient1);
      expect(state.clients[2]).toEqual(mockClient2);
    });

    it('應該能在空列表中加入客戶', () => {
      const state = reducer(initialState, addClient(mockClient1));

      expect(state.clients).toHaveLength(1);
      expect(state.clients[0]).toEqual(mockClient1);
    });
  });

  describe('updateClient', () => {
    it('應該更新列表中的客戶資料', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2],
      };

      const updatedClient: Client = {
        client: {
          ...mockClient1.client,
          name: '更新後的名字',
          email: 'updated@example.com',
        },
      };

      const state = reducer(stateWithClients, updateClient(updatedClient));

      expect(state.clients).toHaveLength(2);
      expect(state.clients[0]).toEqual(updatedClient);
      expect(state.clients[0].client.name).toBe('更新後的名字');
      expect(state.clients[1]).toEqual(mockClient2);
    });

    it('如果選中的客戶被更新，應該同時更新 selectedClient', () => {
      const stateWithSelected = {
        ...initialState,
        clients: [mockClient1, mockClient2],
        selectedClient: mockClient1,
      };

      const updatedClient: Client = {
        client: {
          ...mockClient1.client,
          name: '更新後的名字',
        },
      };

      const state = reducer(stateWithSelected, updateClient(updatedClient));

      expect(state.selectedClient).toEqual(updatedClient);
      expect(state.selectedClient?.client.name).toBe('更新後的名字');
    });

    it('如果更新的客戶不存在，應該不改變列表', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2],
      };

      const nonExistentClient: Client = {
        client: {
          id: 999,
          name: '不存在的客戶',
          email: 'none@example.com',
          mobile: '0900000000',
          gender: 'male',
        },
      };

      const state = reducer(stateWithClients, updateClient(nonExistentClient));

      expect(state.clients).toHaveLength(2);
      expect(state.clients).toEqual([mockClient1, mockClient2]);
    });
  });

  describe('removeClient', () => {
    it('應該從列表中移除指定的客戶', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2, mockClient3],
      };

      const state = reducer(stateWithClients, removeClient(2));

      expect(state.clients).toHaveLength(2);
      expect(state.clients).toEqual([mockClient1, mockClient3]);
      expect(state.clients.find(c => c.client.id === 2)).toBeUndefined();
    });

    it('如果移除的是選中的客戶，應該清空 selectedClient', () => {
      const stateWithSelected = {
        ...initialState,
        clients: [mockClient1, mockClient2],
        selectedClient: mockClient1,
      };

      const state = reducer(stateWithSelected, removeClient(1));

      expect(state.clients).toHaveLength(1);
      expect(state.clients[0]).toEqual(mockClient2);
      expect(state.selectedClient).toBeNull();
    });

    it('如果移除的不是選中的客戶，selectedClient 應該保持不變', () => {
      const stateWithSelected = {
        ...initialState,
        clients: [mockClient1, mockClient2],
        selectedClient: mockClient1,
      };

      const state = reducer(stateWithSelected, removeClient(2));

      expect(state.clients).toHaveLength(1);
      expect(state.selectedClient).toEqual(mockClient1);
    });

    it('如果客戶不存在，應該不改變列表', () => {
      const stateWithClients = {
        ...initialState,
        clients: [mockClient1, mockClient2],
      };

      const state = reducer(stateWithClients, removeClient(999));

      expect(state.clients).toHaveLength(2);
      expect(state.clients).toEqual([mockClient1, mockClient2]);
    });
  });

  describe('整合場景測試', () => {
    it('應該正確處理完整的客戶管理流程', () => {
      // 1. 開始載入
      let state = reducer(initialState, setClientsLoading(true));
      expect(state.isLoading).toBe(true);

      // 2. 載入客戶列表
      state = reducer(state, setClients([mockClient1, mockClient2]));
      expect(state.clients).toHaveLength(2);
      expect(state.error).toBeNull();

      // 3. 完成載入
      state = reducer(state, setClientsLoading(false));
      expect(state.isLoading).toBe(false);

      // 4. 選擇客戶
      state = reducer(state, setSelectedClient(mockClient1));
      expect(state.selectedClient).toEqual(mockClient1);

      // 5. 新增客戶
      state = reducer(state, addClient(mockClient3));
      expect(state.clients).toHaveLength(3);

      // 6. 更新客戶
      const updated = { ...mockClient1, client: { ...mockClient1.client, name: '新名字' } };
      state = reducer(state, updateClient(updated));
      expect(state.clients.find(c => c.client.id === 1)?.client.name).toBe('新名字');

      // 7. 設定搜尋
      state = reducer(state, setSearchQuery('測試'));
      expect(state.searchQuery).toBe('測試');

      // 8. 移除客戶
      state = reducer(state, removeClient(2));
      expect(state.clients).toHaveLength(2);

      // 9. 清除所有資料
      state = reducer(state, clearClients());
      expect(state).toEqual(initialState);
    });

    it('應該正確處理錯誤情況', () => {
      // 1. 開始載入
      let state = reducer(initialState, setClientsLoading(true));
      expect(state.isLoading).toBe(true);

      // 2. 發生錯誤
      state = reducer(state, setClientsError('網路錯誤'));
      expect(state.error).toBe('網路錯誤');
      expect(state.isLoading).toBe(false);

      // 3. 重新載入成功，錯誤應該被清除
      state = reducer(state, setClients([mockClient1]));
      expect(state.error).toBeNull();
      expect(state.clients).toHaveLength(1);
    });
  });
});
