import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { closeModal } from '../../slices/modalSlice';
import { RootState } from '../../store';
import NewRoomForm from '../rooms/NewRoomForm';

export const Modal = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal);

  if (!modal) {
    return null;
  }
  let component;
  switch (modal) {
    case 'newRoom':
      component = <NewRoomForm />;
      break;
    default:
      return null;
  }

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div className="modal-background">
      <button className="x-button" onClick={handleClose}>
        X
      </button>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
};
