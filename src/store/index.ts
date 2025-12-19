import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import visitsReducer from './slices/visitsSlice';
import clientsReducer from './slices/clientsSlice';
import Reactotron from '../../ReactotronConfig';

// Custom middleware to log state changes to Reactotron
const stateLoggerMiddleware: Middleware = store => next => action => {
  if (__DEV__) {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    Reactotron.display({
      name: '🔄 STATE CHANGE',
      preview: (action as any).type || 'Unknown Action',
      value: {
        action,
        prevState,
        nextState,
      },
      important: true,
    });

    return result;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    visits: visitsReducer,
    clients: clientsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(stateLoggerMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
