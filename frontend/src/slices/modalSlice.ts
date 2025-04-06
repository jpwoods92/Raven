import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: () => {
      return { open: true };
    },
    closeModal: () => {
      return { open: false };
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
