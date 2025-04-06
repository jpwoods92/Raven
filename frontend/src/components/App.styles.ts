import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 280,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
}));

export const UserInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const MainContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

export const ContentArea = styled(Box)({
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
});
