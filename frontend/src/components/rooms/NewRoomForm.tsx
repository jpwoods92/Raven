import React, { useState, KeyboardEvent, ChangeEvent, FormEvent } from 'react';

import { useCreateRoomMutation } from '@/services/room';
import { closeModal } from '@/slices/modalSlice';
import { useAppDispatch } from '@/store';

const NewRoomForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [touched, setTouched] = useState(false);

  const [createRoom] = useCreateRoomMutation();

  const validateTitle = (value: string): { isValid: boolean; errorMessage: string | null } => {
    if (!value.trim()) {
      return { isValid: false, errorMessage: "don't forget your title!" };
    }

    if (!value.match(/[a-zA-Z0-9]/g)) {
      return { isValid: false, errorMessage: 'please input more than just symbols/spaces' };
    }

    return { isValid: true, errorMessage: null };
  };

  const validation = touched ? validateTitle(title) : { isValid: false, errorMessage: null };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove disallowed characters (# and .)
    const value = e.target.value.replace(/[#.]/g, '');
    setTitle(value);

    if (!touched) {
      setTouched(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validation.isValid) {
      createRoom({ title, isPrivate });
      dispatch(closeModal());
    }
  };

  const handleClick = () => {
    setIsPrivate(!isPrivate);
  };

  const handleKey = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && validation.isValid) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  return (
    <div className="newroom-form-div">
      <h1 className="newroom-title">Create a room</h1>
      <p className="newroom-body">
        Rooms are where your members communicate. They&apos;re best when organized around a topic —
        #leads, for example.
      </p>
      <form className="newroom-form" onKeyDown={handleKey} onSubmit={handleSubmit}>
        <div className="switch-text-container" onClick={handleClick}>
          <div className="switch">
            <input type="checkbox" readOnly checked={isPrivate} />
            <span className="slider round"></span>
          </div>
          <div className="text-label">Anyone in your workspace can view and join this room.</div>
        </div>
        <span className="title-label">Name</span>
        {validation.errorMessage && <p className="error-text">{validation.errorMessage}</p>}
        <input
          maxLength={22}
          className="newroom-input"
          type="text"
          autoComplete="off"
          value={title}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="# e.g. leads"
        />
        <span className="input-subtext">
          Names must be lowercase, without spaces or periods, and shorter than 22 characters.
        </span>
        <div className="button-container">
          <button
            className="cancel-button"
            onClick={(e) => {
              e.preventDefault();
              dispatch(closeModal());
            }}
          >
            Cancel
          </button>
          <button
            disabled={!validation.isValid}
            className={`modal-button ${!validation.isValid ? 'disabled' : ''}`}
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRoomForm;
