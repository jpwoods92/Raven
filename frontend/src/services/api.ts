import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { LoginResponse, LoginRequest } from '../types';

import { importMeta } from '@/constants';

// Define your API types based on your backend

// Create the API with RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: importMeta.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
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
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation } = api;
