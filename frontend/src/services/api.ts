import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Room, Message, User } from "../types";

// Define your API types based on your backend
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface MessageRequest {
  content: string;
  roomId: string;
}

// Create the API with RTK Query
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Room", "Message", "User"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // User endpoints
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Room endpoints
    getRooms: builder.query<Room[], void>({
      query: () => "/rooms",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Room" as const, id })), "Room"]
          : ["Room"],
    }),

    getRoomById: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),

    createRoom: builder.mutation<Room, Partial<Room>>({
      query: (room) => ({
        url: "/rooms",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Room"],
    }),

    // Message endpoints
    getMessages: builder.query<Message[], string>({
      query: (roomId) => `/rooms/${roomId}/messages`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Message" as const, id })),
              "Message",
            ]
          : ["Message"],
    }),

    sendMessage: builder.mutation<Message, MessageRequest>({
      query: (message) => ({
        url: "/messages",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useGetUserQuery,
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = api;
