import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#192535',
    },
    secondary: {
      main: '#221d23',
    },
    background: {
      default: '#192535',
      paper: '#221d23',
    },
    text: {
      primary: '#a9fff7',
      secondary: '#d6c9c9',
      link: '#a9fff7',
      error: '#C44536 ',
    },
    highlight: {
      main: '#00FFFF',
    },
    accent: {
      main: '#d6c9c9',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
