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
import storage from 'redux-persist/lib/storage';

import departmentReducer from './slices/departmentSlice';
import facultyReducer from './slices/facultySlice';
import studentReducer from './slices/studentSlice';
import courseReducer from './slices/courseSlice';
import activityReducer from './slices/activitySlice';
import notificationReducer from './slices/notificationSlice';
// New module reducers (additive extension — no existing code changed)
import workloadReducer from './slices/workloadSlice';
import meetingsReducer from './slices/meetingsSlice';
import resourcesReducer from './slices/resourcesSlice';

const rootReducer = combineReducers({
  departments: departmentReducer,
  faculty: facultyReducer,
  students: studentReducer,
  courses: courseReducer,
  activity: activityReducer,
  notifications: notificationReducer,
  workload: workloadReducer,
  meetings: meetingsReducer,
  resources: resourcesReducer,
});

const persistConfig = {
  key: 'collegehub_root_v1',
  version: 1,
  storage,
  whitelist: [
    'departments',
    'faculty',
    'students',
    'courses',
    'activity',
    'notifications',
    'workload',
    'meetings',
    'resources',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
