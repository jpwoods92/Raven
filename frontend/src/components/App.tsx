import { Circle, ExitToApp } from '@mui/icons-material';
import { Typography, Avatar, Box, Stack, Divider } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../slices/authSlice';
import { useAppSelector } from '../store';

import { SidebarContainer, UserInfoContainer, MainContainer, ContentArea } from './App.styles';
import { AppButton } from './common/AppButton';
import MessagesArea from './messages/MessagesArea';
import { RoomsList } from './rooms/RoomsList';

const MainApp = () => {
  const dispatch = useDispatch();
  const avatar = useAppSelector((state) => state.auth.user?.avatar);
  const username = useAppSelector((state) => state.auth.user?.username);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <MainContainer>
      {isAuthenticated && (
        <SidebarContainer elevation={0}>
          <UserInfoContainer>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {avatar || (
                  <Typography variant="subtitle1" fontWeight="medium" color="textPrimary">
                    {username?.charAt(0).toUpperCase()}
                  </Typography>
                )}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="medium">
                {username}
              </Typography>
              <Circle sx={{ height: '0.5em', width: '0.5em' }} color="success" />
            </Stack>
            <AppButton size="small" onClick={handleClick} startIcon={<ExitToApp />} color="inherit">
              Logout
            </AppButton>
          </UserInfoContainer>
          <Divider />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <RoomsList />
          </Box>
        </SidebarContainer>
      )}
      <ContentArea>
        <MessagesArea />
      </ContentArea>
    </MainContainer>
  );
};

export default MainApp;
