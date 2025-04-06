import { Send as SendIcon } from '@mui/icons-material';
import { Box, InputAdornment, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRoomSocket } from '../../hooks/useRoomSocket';
import { InputField } from '../common/InputField';

import styles from './NewMessageForm.styles';

import { useAppSelector } from '@/store';

const NewMessageForm: React.FC = () => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[id as string]);
  const [body, setBody] = useState('');

  const { sendMessage } = useRoomSocket({ roomId: room?.id });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (body.trim()) {
      sendMessage(body);
      setBody('');
    }
  };

  const handleSendClick = () => {
    if (body.trim()) {
      sendMessage(body);
      setBody('');
    }
  };

  if (!room) return null;

  return (
    <Box sx={styles.newMessageForm}>
      <Box component="form" sx={styles.form} onSubmit={handleSubmit}>
        <InputField
          variant="outlined"
          value={body}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${room?.title}`}
          multiline
          maxRows={4}
          sx={styles.textField}
          slotProps={{
            input: {
              sx: styles.input,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendClick} disabled={!body.trim()}>
                    <SendIcon sx={{ color: 'text.secondary' }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default NewMessageForm;
