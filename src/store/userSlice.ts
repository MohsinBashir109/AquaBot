import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  userName: string;
  email: string;
  farmLocation: string;
  token?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserLocation: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.farmLocation = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, setLoading, updateUserLocation } =
  userSlice.actions;
export default userSlice.reducer;
