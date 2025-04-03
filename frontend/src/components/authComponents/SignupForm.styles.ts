import { Theme } from '@mui/material/styles';

export const signupFormStyles = (_theme: Theme) => ({
  container: {
    maxWidth: 'sm',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
  },
  paper: {
    p: 4,
    backgroundColor: 'background.paper',
    borderRadius: 2,
  },
  form: {
    width: '100%',
  },
  title: {
    color: 'text.primary',
    textAlign: 'center',
    mb: 3,
  },
  description: {
    mb: 3,
    color: 'text.secondary',
    textAlign: 'center',
  },
  inputStack: {
    spacing: 3,
  },
  link: {
    color: 'highlight.main',
  },
  loginText: {
    mt: 1,
    color: 'text.secondary',
  },
  submitButton: {
    mt: 2,
    py: 1.5,
    backgroundColor: 'primary.main',
    color: 'text.primary',
    '&:hover': {
      backgroundColor: 'highlight.main',
      color: 'secondary.main',
    },
  },
  errorContainer: {
    mt: 2,
  },
  errorAlert: {
    mb: 1,
    backgroundColor: 'secondary.main',
    color: 'text.error',
  },
});
