import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IrrigationPlanDetailsDto } from '../types/dashboard.types';

interface IrrigationPlansState {
  plans: IrrigationPlanDetailsDto[];
  loading: boolean;
  error: string | null;
  lastFetched: string | null; // ISO timestamp
  isOffline: boolean;
}

const initialState: IrrigationPlansState = {
  plans: [],
  loading: false,
  error: null,
  lastFetched: null,
  isOffline: false,
};

const irrigationPlansSlice = createSlice({
  name: 'irrigationPlans',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<IrrigationPlanDetailsDto[]>) => {
      state.plans = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = new Date().toISOString();
      state.isOffline = false;
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
    addPlan: (state, action: PayloadAction<IrrigationPlanDetailsDto>) => {
      // Check if plan already exists
      const existingIndex = state.plans.findIndex(
        plan => plan.id === action.payload.id,
      );
      if (existingIndex >= 0) {
        state.plans[existingIndex] = action.payload;
      } else {
        state.plans.push(action.payload);
      }
    },
    updatePlan: (
      state,
      action: PayloadAction<{
        id: number;
        updates: Partial<IrrigationPlanDetailsDto>;
      }>,
    ) => {
      const index = state.plans.findIndex(
        plan => plan.id === action.payload.id,
      );
      if (index >= 0) {
        state.plans[index] = { ...state.plans[index], ...action.payload.updates };
      }
    },
    removePlan: (state, action: PayloadAction<number>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },
    clearPlans: state => {
      state.plans = [];
      state.error = null;
      state.lastFetched = null;
    },
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    loadPlansFromCache: (
      state,
      action: PayloadAction<IrrigationPlanDetailsDto[]>,
    ) => {
      state.plans = action.payload;
      state.isOffline = true;
      state.loading = false;
    },
  },
});

export const {
  setPlans,
  setLoading,
  setError,
  addPlan,
  updatePlan,
  removePlan,
  clearPlans,
  setOffline,
  loadPlansFromCache,
} = irrigationPlansSlice.actions;

export default irrigationPlansSlice.reducer;

