import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import irrigationPlansReducer from './irrigationPlansSlice';
import chatReducer from './chatSlice';
import irrigationScheduleReducer from './irrigationScheduleSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    irrigationPlans: irrigationPlansReducer,
    chat: chatReducer,
    irrigationSchedule: irrigationScheduleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
