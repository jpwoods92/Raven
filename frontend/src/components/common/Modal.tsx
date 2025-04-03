import React from 'react';
import { useDispatch } from 'react-redux';

import { closeModal } from '../../slices/modalSlice';

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div className="modal-background">
      <button className="x-button" onClick={handleClose}>
        X
      </button>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
