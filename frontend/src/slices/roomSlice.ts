import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../types';
import { api } from '../services/api';

interface RoomState {
  currentRoomId: string | null;
  joinedRooms: string[];
  rooms: Record<string, Room>; // Store rooms by ID for easy lookup
  allRoomIds: string[]; // Keep a list of all room IDs for ordering
  isLoading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  currentRoomId: null,
  joinedRooms: [],
  rooms: {},
  allRoomIds: [],
  isLoading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoomId = action.payload;

      // Add to joined rooms if not already there
      if (!state.joinedRooms.includes(action.payload)) {
        state.joinedRooms.push(action.payload);
      }
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      if (!state.joinedRooms.includes(action.payload)) {
        state.joinedRooms.push(action.payload);
      }
    },
    leaveRoom: (state, action: PayloadAction<string>) => {
      state.joinedRooms = state.joinedRooms.filter((id) => id !== action.payload);

      // If we left the current room, set current to null
      if (state.currentRoomId === action.payload) {
        state.currentRoomId = null;
      }
    },
    addRoom: (state, action: PayloadAction<Room>) => {
      const room = action.payload;
      state.rooms[room.id] = room;
      if (!state.allRoomIds.includes(room.id)) {
        state.allRoomIds.push(room.id);
      }
    },
    updateRoom: (state, action: PayloadAction<Room>) => {
      const room = action.payload;
      if (state.rooms[room.id]) {
        state.rooms[room.id] = room;
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      delete state.rooms[roomId];
      state.allRoomIds = state.allRoomIds.filter((id) => id !== roomId);

      // Also remove from joinedRooms if present
      state.joinedRooms = state.joinedRooms.filter((id) => id !== roomId);

      // Clear currentRoomId if it's the removed room
      if (state.currentRoomId === roomId) {
        state.currentRoomId = null;
      }
    },
  },
  // Integrate with RTK Query results
  extraReducers: (builder) => {
    // When RTK Query starts loading rooms
    builder.addMatcher(api.endpoints.getRooms.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    // When RTK Query successfully fetches rooms
    builder.addMatcher(api.endpoints.getRooms.matchFulfilled, (state, { payload }) => {
      state.isLoading = false;

      // Create a record of rooms by ID
      const roomsById: Record<string, Room> = {};
      const roomIds: string[] = [];

      payload.forEach((room) => {
        roomsById[room.id] = room;
        roomIds.push(room.id);
      });

      state.rooms = roomsById;
      state.allRoomIds = roomIds;
    });

    // When RTK Query fails to fetch rooms
    builder.addMatcher(api.endpoints.getRooms.matchRejected, (state, { error }) => {
      state.isLoading = false;
      state.error = error.message || 'Failed to fetch rooms';
    });

    // When a new room is created
    builder.addMatcher(api.endpoints.createRoom.matchFulfilled, (state, { payload }) => {
      state.rooms[payload.id] = payload;
      if (!state.allRoomIds.includes(payload.id)) {
        state.allRoomIds.push(payload.id);
      }
    });
  },
});

// Selectors
export const selectRooms = (state: { rooms: RoomState }) =>
  state.rooms.allRoomIds.map((id) => state.rooms.rooms[id]);

export const selectRoomById = (state: { rooms: RoomState }, roomId: string) =>
  state.rooms.rooms[roomId];

export const selectCurrentRoom = (state: { rooms: RoomState }) =>
  state.rooms.currentRoomId ? state.rooms.rooms[state.rooms.currentRoomId] : null;

export const selectJoinedRooms = (state: { rooms: RoomState }) =>
  state.rooms.joinedRooms.map((id) => state.rooms.rooms[id]).filter(Boolean);

export const { setCurrentRoom, joinRoom, leaveRoom, addRoom, updateRoom, removeRoom } =
  roomSlice.actions;

export default roomSlice.reducer;
