import { AddCircleOutlined } from '@mui/icons-material';
import { Box, Typography, List, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import NewRoomForm from './NewRoomForm';
import { SectionHeader, AddRoomButton } from './RoomsList.styles';
import { RoomsListItem } from './RoomsListItem';

import { useGetRoomsQuery } from '@/services/room';
import { openModal } from '@/slices/modalSlice';
import { useAppSelector } from '@/store';

export const RoomsList = () => {
  const dispatch = useDispatch();
  const allRoomIds = useAppSelector((state) => state.rooms.allRoomIds);
  const rooms = useAppSelector((state) => state.rooms.rooms);

  useGetRoomsQuery();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  const { privateRooms, regularRooms } = useMemo(() => {
    const rRooms: string[] = [];
    const pRooms: string[] = [];
    allRoomIds.forEach((roomId: string) => {
      if (rooms[roomId].isPrivate) {
        pRooms.push(roomId);
      } else {
        rRooms.push(roomId);
      }
    });
    return { privateRooms: pRooms, regularRooms: rRooms };
  }, [allRoomIds, rooms]);

  return (
    <>
      <NewRoomForm />
      <Box sx={{ height: '100%' }}>
        <SectionHeader>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
            PUBLIC
          </Typography>
        </SectionHeader>

        <List disablePadding>
          {regularRooms.map((roomId) => (
            <RoomsListItem key={roomId} roomId={roomId} />
          ))}
        </List>

        {privateRooms.length > 0 && (
          <>
            <SectionHeader sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                PRIVATE
              </Typography>
            </SectionHeader>

            <List disablePadding>
              {privateRooms.map((roomId) => (
                <RoomsListItem key={roomId} roomId={roomId} />
              ))}
            </List>
          </>
        )}

        <AddRoomButton onClick={() => handleOpenModal()}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AddCircleOutlined sx={{ color: 'text.secondary' }} />
            <Typography color="text.secondary">Add New Room</Typography>
          </Stack>
        </AddRoomButton>
      </Box>
    </>
  );
};
