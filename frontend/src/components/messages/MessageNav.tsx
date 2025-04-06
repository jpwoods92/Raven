import { PersonOutline } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { styles } from './MessageNav.styles';

import { useRoomSocket } from '@/hooks/useRoomSocket';
import { useAppSelector } from '@/store';

const MessageNav: React.FC = () => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);

  const { roomMembers } = useRoomSocket({ roomId: id });

  return (
    <Box component="header" sx={styles.messageNav}>
      <Typography sx={styles.headerTitle} color="textSecondary">
        {room?.title}
      </Typography>
      <Box sx={styles.usersCount}>
        <PersonOutline sx={styles.icon} />
        <Typography sx={{ fontSize: '0.8rem' }}>{roomMembers.length}</Typography>
      </Box>
    </Box>
  );
};

export default MessageNav;
