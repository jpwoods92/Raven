import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  messageListItem: {
    display: 'flex',
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  avatarContainer: {
    marginRight: '12px',
  },
  messageContents: {
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  },
  username: {
    fontWeight: 'bold',
    marginRight: '8px',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'text.secondary',
  },
  messageBody: {
    wordBreak: 'break-word',
  },
};
