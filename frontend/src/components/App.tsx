import { Circle } from '@mui/icons-material';
import React from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../slices/authSlice';
import { useAppSelector } from '../store';

import MessagesArea from './messages/MessagesArea';
import { RoomsList } from './rooms/RoomsList';

const MainApp = () => {
  const dispatch = useDispatch();
  const username = useAppSelector((state) => state.auth.user?.username);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div>
      <div>
        <header>
          {isAuthenticated && (
            <>
              <p id="username">
                <Circle fontSize="small" /> {username}
              </p>
              <button id="nav-logout" onClick={handleClick}>
                Log Out
              </button>
            </>
          )}
        </header>
        <RoomsList />
      </div>
      <MessagesArea />
    </div>
  );
};

export default MainApp;
