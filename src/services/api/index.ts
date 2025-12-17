// Export all API services
export * from './config';
export * from './endpoints.config';
export * from './auth.api';
export * from './me.api';
export * from './types';

// Convenient re-exports
export { apiClient } from './config';
export { API_ENDPOINTS, getEndpoints } from './endpoints.config';
export { authApi } from './auth.api';
export { meApi } from './me.api';
export { clientsApi } from './clients.api';
export { categoriesApi } from './categories.api';
export { contractsApi } from './contracts.api';
export { shareContractsApi } from './shareContracts.api';
export { visitsApi } from './visits.api';
export { simplyBookApi } from './simplyBook.api';
