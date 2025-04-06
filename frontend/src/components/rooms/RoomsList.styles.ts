import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1, 2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const AddRoomButton = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.highlight.main,
    '& .MuiTypography-root': {
      color: theme.palette.secondary.main,
    },
  },
}));
