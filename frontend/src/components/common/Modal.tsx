import CloseIcon from '@mui/icons-material/Close';
import { Modal as MuiModal, Box, IconButton, SxProps, Theme } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';

import { closeModal } from '../../slices/modalSlice';

import { useAppSelector } from '@/store';

const styles: Record<string, SxProps<Theme>> = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    maxWidth: '90%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: (theme) => theme.palette.grey[500],
  },
  childrenContainer: {
    mt: 2,
  },
};

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const open = useAppSelector((state) => state.modal.open);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={styles.modalContent}>
        <IconButton aria-label="close" onClick={handleClose} sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <Box sx={styles.childrenContainer}>{children}</Box>
      </Box>
    </MuiModal>
  );
};
