import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { LoginResponse, LoginRequest, RegisterResponse, RegisterRequest } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepareHeaders: (headers, { getState }: { getState: () => any }) => {
      // Get the token from auth state
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    setupMfa: builder.mutation<{ qrCodeUrl: string }, void>({
      query: () => ({
        url: '/auth/mfa/setup',
        method: 'POST',
      }),
    }),
    verifyMfa: builder.mutation<{ success: boolean }, { token: string }>({
      query: (data) => ({
        url: '/auth/mfa/verify',
        method: 'POST',
        body: data,
      }),
    }),
    verifyMfaLogin: builder.mutation<LoginResponse, { tempToken: string; token: string }>({
      query: (data) => ({
        url: '/auth/mfa/login',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useRegisterMutation } = authApi;
