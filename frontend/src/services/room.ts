import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Room } from '../types';

const baseUrl =
  (process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000') + '/api';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
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
  tagTypes: ['Room', 'RoomMembership'],
  endpoints: (builder) => ({
    createRoom: builder.mutation<Room, { title: string; isPrivate: boolean }>({
      query: (createRoomDto) => ({
        url: '/rooms',
        method: 'POST',
        body: createRoomDto,
      }),
      invalidatesTags: ['Room'],
    }),

    getRooms: builder.query<Room[], void>({
      query: () => '/rooms',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Room' as const, id })),
              { type: 'Room', id: 'LIST' },
            ]
          : [{ type: 'Room', id: 'LIST' }],
    }),

    getRoom: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Room', id }],
    }),

    updateRoom: builder.mutation<Room, { id: string; updateData: Partial<Room> }>({
      query: ({ id, updateData }) => ({
        url: `/rooms/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Room', id }],
    }),

    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),

    addRoomMember: builder.mutation<void, { roomId: string; newMemberId: string }>({
      query: ({ roomId, newMemberId }) => ({
        url: `/rooms/${roomId}/members/${newMemberId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'Room', id: roomId },
        'RoomMembership',
      ],
    }),

    removeRoomMember: builder.mutation<void, { roomId: string; memberId: string }>({
      query: ({ roomId, memberId }) => ({
        url: `/rooms/${roomId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'Room', id: roomId },
        'RoomMembership',
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateRoomMutation,
  useGetRoomsQuery,
  useGetRoomQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useAddRoomMemberMutation,
  useRemoveRoomMemberMutation,
} = roomApi;
