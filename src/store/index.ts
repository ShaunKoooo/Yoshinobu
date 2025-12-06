import {configureStore, Middleware} from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
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
    counter: counterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(stateLoggerMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
