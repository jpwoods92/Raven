import { PersonOutline } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { UserSearch } from '../common/UserSearch';

import { styles } from './MessageNav.styles';

import { useRoomSocket } from '@/hooks/useRoomSocket';
import { useAddRoomMemberMutation } from '@/services/room';
import { useGetUsersByRoomIdQuery } from '@/services/user';
import { useAppSelector } from '@/store';
import { User } from '@/types';

const MessageNav: React.FC = () => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);

  const { roomMembers } = useRoomSocket({ roomId: id });

  const [addRoomMember] = useAddRoomMemberMutation();
  const { data: users = [], refetch } = useGetUsersByRoomIdQuery(id, { skip: !id });

  const allRoomMembers = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, User>
    );
  }, [users]);

  const handleAddUser = async (user: User | null) => {
    if (user) {
      await addRoomMember({ roomId: id, newMemberId: user.id });
      refetch();
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
      <Tooltip
        title={`Online: ${roomMembers.map((userId) => allRoomMembers[userId]?.username)?.join(', ')}`}
      >
        <Box sx={styles.usersCount}>
          <PersonOutline sx={styles.icon} />
          <Typography sx={{ fontSize: '0.8rem' }}>{roomMembers.length}</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default MessageNav;
