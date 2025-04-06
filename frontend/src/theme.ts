import { createTheme, ThemeOptions } from '@mui/material';

// Extend the default theme palette to include our custom colors
declare module '@mui/material/styles' {
  interface Palette {
    highlight: Palette['primary'];
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    highlight?: PaletteOptions['primary'];
    accent?: PaletteOptions['primary'];
  }

  interface TypeText {
    link?: string;
    error?: string;
  }

  interface TypeTextOptions {
    link?: string;
    error?: string;
  }
}

const themeOptions: ThemeOptions = {
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
      error: '#C44536',
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
};

const theme = createTheme(themeOptions);

export default theme;
