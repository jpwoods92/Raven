import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      return action.payload;
    },
    closeModal: () => {
      return null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
