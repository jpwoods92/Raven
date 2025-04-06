import { Box, Link, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import NewRoomForm from '../rooms/NewRoomForm';

import MessageListItem from './MessageListItem';
import MessageNav from './MessageNav';
import { styles } from './MessagesArea.styles';
import NewMessageForm from './NewMessageForm';

import { useRoomSocket } from '@/hooks/useRoomSocket';
import { openModal } from '@/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import { Message } from '@/types';

const MessagesArea: React.FC = () => {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = useRoomSocket({ roomId: room?.id });

  useEffect(() => {
    if (room?.title !== undefined) {
      scrollToBottom();
    }
  }, [room?.title]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sortedMessages = (messagesToSort: Message[]) => {
    const dupedMessages = [...messagesToSort];
    return dupedMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  if (!messages) return null;

  const messageItems = sortedMessages(messages).map((message) => (
    <MessageListItem key={message.id} message={message} />
  ));

  const handleOpenNewRoomForm = () => {
    dispatch(openModal());
  };

  return (
    <>
      <NewRoomForm />
      <Box sx={styles.messagesArea}>
        <MessageNav />
        {room ? (
          <Box sx={styles.messagesContainer}>
            <Box component="ul" sx={styles.messageList}>
              {messageItems}
              <Box ref={messagesEndRef} />
            </Box>
            <NewMessageForm />
          </Box>
        ) : (
          <Box sx={styles.emptyState}>
            <Typography>
              Select a room to start messaging or{' '}
              <Link sx={styles.createRoomLink} onClick={handleOpenNewRoomForm}>
                Create A Room
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MessagesArea;
