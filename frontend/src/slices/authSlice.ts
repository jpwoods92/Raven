import { createSlice } from '@reduxjs/toolkit';

import { authApi } from '../services/auth';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.token = payload.accessToken;
      state.user = payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', payload.accessToken);
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', payload.accessToken);
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
