import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

import { styles } from './MessageListItem.styles';

import { Message } from '@/types';

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Box component="li" sx={styles.messageListItem}>
      <Box sx={styles.avatarContainer}>
        <Avatar src={message.user?.avatar} alt={message.user?.username || ''} />
      </Box>
      <Box sx={styles.messageContents}>
        <Box sx={styles.headerContainer}>
          <Typography sx={styles.username} color="textSecondary">
            {message.user?.displayname || message.user?.username}
          </Typography>
          <Typography sx={styles.timestamp} color="textSecondary">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
        <Typography sx={styles.messageBody} color="textPrimary">
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageListItem;
