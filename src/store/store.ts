import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import soundReducer from './features/sound/soundSlice';
import breathingReducer from './features/breathing/breathingSlice';

// Combine all reducers
const rootReducer = combineReducers({
  sound: soundReducer,
  breathing: breathingReducer,
});

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 2, // Incremented to invalidate old cached state
  migrate: (state: any) => {
    // If migrating from version 1 to 2, ensure breathing state has new fields
    if (state && state.breathing) {
      return Promise.resolve({
        ...state,
        breathing: {
          ...state.breathing,
          exerciseTitle: state.breathing.exerciseTitle || 'Box 4-4-4-4',
          exerciseDescription: state.breathing.exerciseDescription || 'Inhale, hold, exhale, and hold for four counts each to calm your body and mind.',
        },
      });
    }
    return Promise.resolve(state);
  },
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
