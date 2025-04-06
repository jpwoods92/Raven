import { Tag, Close, LockOutlined } from '@mui/icons-material';
import { ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { StyledListItemButton } from './RoomsListItem.styles';

import { useDeleteRoomMutation } from '@/services/room';
import { setCurrentRoom } from '@/slices/roomSlice';
import { useAppDispatch, useAppSelector } from '@/store';

export const RoomsListItem = ({ roomId }: { roomId: string }) => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[roomId]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteRoom] = useDeleteRoomMutation();

  const onNavigate = () => {
    dispatch(setCurrentRoom(roomId));
    navigate(`/rooms/${roomId}`);
  };

  const onDeleteRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRoom(roomId);
  };

  const isSelected = id === roomId;

  return (
    <ListItem
      disablePadding
      disableGutters
      secondaryAction={
        <IconButton
          size="small"
          onClick={onDeleteRoom}
          sx={{ opacity: 0.6, '&:hover': { opacity: 1 }, color: 'text.primary' }}
        >
          <Close fontSize="small" />
        </IconButton>
      }
      sx={{
        '& .MuiListItemSecondaryAction-root': {
          visibility: 'hidden',
          right: 10,
        },
        '&:hover .MuiListItemSecondaryAction-root': {
          visibility: 'visible',
        },
      }}
    >
      <StyledListItemButton selected={isSelected} onClick={onNavigate}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: isSelected ? 'medium' : 'regular',
              }}
            >
              {room.title}
            </Typography>
          }
          disableTypography
        />
      </StyledListItemButton>
    </ListItem>
  );
};
