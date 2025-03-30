import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { User } from '../types';

import { importMeta } from '@/constants';

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserDto {
  username?: string;
  email?: string;
  displayName?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Create the API with RTK Query
export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get a user by ID (already existed)
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Create a new user
    createUser: builder.mutation<User, CreateUserDto>({
      query: (createUserDto) => ({
        url: '/users',
        method: 'POST',
        body: createUserDto,
      }),
      invalidatesTags: ['User'],
    }),

    // Get all users
    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get a user by username
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/users/username/${username}`,
      providesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
    }),

    // Get a user by email
    getUserByEmail: builder.query<User, string>({
      query: (email) => `/users/email/${email}`,
      providesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
    }),

    // Update a user
    updateUser: builder.mutation<User, { id: string; updateUserDto: UpdateUserDto }>({
      query: ({ id, updateUserDto }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: updateUserDto,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
    }),

    // Change a user's password
    changePassword: builder.mutation<void, { id: string; changePasswordDto: ChangePasswordDto }>({
      query: ({ id, changePasswordDto }) => ({
        url: `/users/${id}/change-password`,
        method: 'PATCH',
        body: changePasswordDto,
      }),
    }),

    // Delete a user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Update a user's online status
    updateOnlineStatus: builder.mutation<User, { id: string; isOnline: boolean }>({
      query: ({ id, isOnline }) => ({
        url: `/users/${id}/online-status`,
        method: 'PATCH',
        body: { isOnline },
      }),
      invalidatesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
    }),

    // Search for users
    searchUsers: builder.query<User[], string>({
      query: (query) => `/users/search?query=${encodeURIComponent(query)}`,
      providesTags: [{ type: 'User', id: 'SEARCH' }],
    }),

    // Get users by room ID
    getUsersByRoomId: builder.query<User[], string>({
      query: (roomId) => `/users/room/${roomId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'ROOM_USERS' },
            ]
          : [{ type: 'User', id: 'ROOM_USERS' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUserQuery,
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByUsernameQuery,
  useLazyGetUserByUsernameQuery,
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useUpdateOnlineStatusMutation,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetUsersByRoomIdQuery,
  useLazyGetUsersByRoomIdQuery,
} = userApi;
