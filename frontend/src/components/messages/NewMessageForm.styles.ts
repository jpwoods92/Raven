import { Theme } from '@mui/material/styles';

export const styles = {
  newMessageForm: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'background.paper',
    borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },
  form: {
    width: '100%',
  },
  textField: {
    width: 'calc(100% - 32px)',
  },
  input: {
    padding: '12px',
    resize: 'none',
    '&::placeholder': {
      opacity: 0.7,
    },
  },
};

export default styles;
