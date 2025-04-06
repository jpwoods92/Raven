import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  messageNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  usersCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'text.secondary',
  },
  icon: {
    fontSize: '1rem',
  },
};
