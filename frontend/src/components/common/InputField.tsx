import { TextField, TextFieldProps, Theme, useTheme } from '@mui/material';
import React from 'react';

const useStyles = (_theme: Theme) => ({
  inputLabel: {
    color: 'text.secondary',
    '&.Mui-focused': {
      color: 'highlight.main',
    },
  },
  input: {
    color: 'text.primary',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'accent.main',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'highlight.main',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'highlight.main',
    },
  },
});

export const InputField: React.FC<TextFieldProps> = ({ slotProps, ...restProps }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  return (
    <TextField
      slotProps={{
        input: {
          sx: styles.input,
        },
        inputLabel: {
          sx: styles.inputLabel,
        },
        ...slotProps,
      }}
      {...restProps}
    />
  );
};
