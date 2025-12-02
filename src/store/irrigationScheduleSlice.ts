import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IrrigationScheduleItem } from '../types/imageAnalysis.types';

interface IrrigationScheduleState {
  items: IrrigationScheduleItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null; // ISO timestamp
}

const initialState: IrrigationScheduleState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const irrigationScheduleSlice = createSlice({
  name: 'irrigationSchedule',
  initialState,
  reducers: {
    setScheduleItems: (
      state,
      action: PayloadAction<IrrigationScheduleItem[]>,
    ) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearScheduleItems: state => {
      state.items = [];
      state.error = null;
      state.lastUpdated = null;
    },
    updateScheduleItem: (
      state,
      action: PayloadAction<{
        index: number;
        updates: Partial<IrrigationScheduleItem>;
      }>,
    ) => {
      if (state.items[action.payload.index]) {
        state.items[action.payload.index] = {
          ...state.items[action.payload.index],
          ...action.payload.updates,
        };
      }
    },
  },
});

export const {
  setScheduleItems,
  setLoading,
  setError,
  clearScheduleItems,
  updateScheduleItem,
} = irrigationScheduleSlice.actions;

export default irrigationScheduleSlice.reducer;

