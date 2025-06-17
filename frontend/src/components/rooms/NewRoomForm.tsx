import { Box, FormControl, FormHelperText, Switch, Typography } from '@mui/material';
import React, { useState, KeyboardEvent, ChangeEvent, FormEvent } from 'react';

import { AppButton } from '../common/AppButton';
import { InputField } from '../common/InputField';

import { styles } from './NewRoomForm.styles';

import { Modal } from '@/components/common/Modal';
import { useCreateRoomMutation } from '@/services/room';
import { closeModal } from '@/slices/modalSlice';
import { useAppDispatch } from '@/store';
import { validateRoomTitle } from '@/utils/validateRoomTitle';

const NewRoomForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [touched, setTouched] = useState(false);

  const [createRoom] = useCreateRoomMutation();

  const validation = touched ? validateRoomTitle(title) : { isValid: false, errorMessage: null };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (!touched) {
      setTouched(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validation.isValid) {
      createRoom({ title: title.trim(), isPrivate });
      dispatch(closeModal());
    }
  };

  const handleSwitchToggle = () => {
    setIsPrivate(!isPrivate);
  };

  const handleKey = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && validation.isValid) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setTitle('');
    dispatch(closeModal());
  };

  return (
    <Modal>
      <Box sx={styles.formContainer}>
        <Typography variant="h5" component="h1" color="textPrimary" sx={styles.title}>
          Create a room
        </Typography>
        <Typography variant="body1" sx={styles.description}>
          Rooms are where you and friends communicate.
        </Typography>

        <Box component="form" onKeyDown={handleKey} onSubmit={handleSubmit}>
          <Box sx={styles.switchContainer} onClick={handleSwitchToggle}>
            <Switch checked={isPrivate} color="primary" onChange={handleSwitchToggle} />
            <Typography variant="body1" color="textPrimary" sx={styles.switchLabel}>
              Is Private
            </Typography>
          </Box>

          <FormControl fullWidth sx={styles.formField} error={!!validation.errorMessage}>
            <InputField
              id="room-name"
              label="Room Name"
              fullWidth
              value={title}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Family Chat"
              error={!!validation.errorMessage}
              helperText={validation.errorMessage}
              slotProps={{
                htmlInput: {
                  maxLength: 22,
                },
              }}
              size="small"
            />
            <FormHelperText sx={styles.helperText}>
              Names must be lowercase, without spaces or periods, and shorter than 22 characters.
            </FormHelperText>
          </FormControl>

          <Box sx={styles.buttonContainer}>
            <AppButton variant="text" onClick={handleCancel} sx={styles.cancelButton}>
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              type="submit"
              disabled={!validation.isValid}
              sx={styles.createButton}
            >
              Create Room
            </AppButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewRoomForm;
