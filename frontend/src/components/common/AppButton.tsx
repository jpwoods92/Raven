import { Button, styled } from '@mui/material';

export const AppButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.highlight.main,
    color: theme.palette.secondary.main,
  },
}));
