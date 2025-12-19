import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useClients } from 'src/services/hooks';
import {
  setClients,
  setClientsLoading,
  setClientsError,
} from 'src/store/slices/clientsSlice';
import type { RootState } from 'src/store';

/**
 * 整合 React Query 和 Redux 的 useClients hook
 *
 * 使用方式：
 * 1. 在客戶列表頁面使用這個 hook 獲取資料並同步到 Redux
 * 2. 在其他組件中直接從 Redux 讀取資料
 *
 * @param options - 額外選項
 */
export const useClientsWithRedux = (
  options?: {
    enabled?: boolean; // 是否啟用查詢
    syncToRedux?: boolean; // 是否同步到 Redux（預設 true）
  }
) => {
  const dispatch = useDispatch();
  const { enabled = true, syncToRedux = true } = options || {};

  // 從 React Query 取得資料
  const query = useClients();

  // 同步查詢狀態到 Redux
  useEffect(() => {
    if (!syncToRedux) return;

    if (query.isLoading) {
      dispatch(setClientsLoading(true));
    } else {
      dispatch(setClientsLoading(false));
    }

    if (query.isError) {
      dispatch(setClientsError(query.error?.message || '載入失敗'));
    }

    if (query.data) {
      dispatch(setClients(query.data));
    }
  }, [query.data, query.isLoading, query.isError, query.error, syncToRedux, dispatch]);

  return query;
};

/**
 * 從 Redux 讀取 clients 資料的 selector hook
 */
export const useClientsFromRedux = () => {
  return useSelector((state: RootState) => state.clients);
};

/**
 * 從 Redux 讀取選中的 client
 */
export const useSelectedClient = () => {
  return useSelector((state: RootState) => state.clients.selectedClient);
};

/**
 * 從 Redux 讀取當前選中的 client_id
 */
export const useSelectedClientIdFromClients = () => {
  const selectedClient = useSelector((state: RootState) => state.clients.selectedClient);
  return selectedClient?.client.id || null;
};

/**
 * 從 Redux 讀取搜尋關鍵字
 */
export const useSearchQuery = () => {
  return useSelector((state: RootState) => state.clients.searchQuery);
};
