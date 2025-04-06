import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    mb: 2,
  },
  description: {
    mb: 3,
    color: 'text.secondary',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
    cursor: 'pointer',
  },
  switchLabel: {
    ml: 2,
    fontSize: '0.9rem',
  },
  formField: {
    mb: 3,
  },
  inputLabel: {
    fontWeight: 'bold',
    mb: 1,
    display: 'block',
  },
  helperText: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    mt: 0.5,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 2,
    gap: 2,
  },
  cancelButton: {
    color: 'text.primary',
  },
  createButton: {
    fontWeight: 'bold',
  },
};
