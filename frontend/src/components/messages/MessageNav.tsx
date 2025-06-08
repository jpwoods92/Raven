import { PersonOutline } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { UserSearch } from '../common/UserSearch';

import { styles } from './MessageNav.styles';

import { useRoomSocket } from '@/hooks/useRoomSocket';
import { useAddRoomMemberMutation } from '@/services/room';
import { useLazyGetUsersByRoomIdQuery } from '@/services/user';
import { useAppSelector } from '@/store';
import { User } from '@/types';

const MessageNav: React.FC = () => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);
  const [allRoomMembers, setAllRoomMembers] = useState<Record<string, User>>({});

  const { roomMembers } = useRoomSocket({ roomId: id });

  const [addRoomMember] = useAddRoomMemberMutation();
  const [getAllRoomMembers] = useLazyGetUsersByRoomIdQuery();

  useEffect(() => {
    getAllRoomMembers(id, true)
      .unwrap()
      .then((users) => {
        const newRoomMembers = users.reduce(
          (acc, user) => {
            acc[user.id] = user;
            return acc;
          },
          {} as Record<string, User>
        );
        setAllRoomMembers(newRoomMembers);
      });
  }, []);

  const handleAddUser = async (user: User | null) => {
    if (user) {
      await addRoomMember({ roomId: id, newMemberId: user.id });
    }
  };

  return (
    <Box component="header" sx={styles.messageNav}>
      <Typography sx={styles.headerTitle} color="textSecondary">
        {room?.title}
      </Typography>
      {room?.isPrivate && (
        <UserSearch onChange={handleAddUser} userIdsToFilterOut={Object.keys(allRoomMembers)} />
      )}
      <Tooltip title={roomMembers.map((userId) => allRoomMembers[userId].username).join(', ')}>
        <Box sx={styles.usersCount}>
          <PersonOutline sx={styles.icon} />
          <Typography sx={{ fontSize: '0.8rem' }}>{roomMembers.length}</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default MessageNav;
