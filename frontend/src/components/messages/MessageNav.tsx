import { VerifiedUserOutlined } from '@mui/icons-material';
import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { useGetUsersByRoomIdQuery } from '@/services/user';
import { useAppSelector } from '@/store';

const MessageNav: React.FC = () => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);

  const { data: members = [] } = useGetUsersByRoomIdQuery(room?.id, {
    skip: !room?.id || room.isPrivate,
  });

  if (!room?.isPrivate) return null;

  return (
    <Fragment>
      <header className="message-nav">
        <p id="header-title">#{room?.title}</p>
        <p id="num-users">
          <VerifiedUserOutlined />
          {members.length}
        </p>
      </header>
    </Fragment>
  );
};

export default MessageNav;
