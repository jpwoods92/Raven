import { AppBar, Toolbar, Button, Box, Container, Link } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import ravenLogo from '@/assets/RavenLogo.png';

const styles = {
  appBar: {
    backgroundColor: 'background.paper',
  },
  logoContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    height: '40px',
    marginRight: '10px',
    borderRadius: 4,
  },
  appName: {
    fontWeight: 700,
    color: 'inherit',
    textDecoration: 'none',
  },
  buttonsContainer: {
    display: 'flex',
    gap: 2,
  },
  button: {
    backgroundColor: 'primary.main',
    color: 'text.primary',
    '&:hover': {
      backgroundColor: 'highlight.main',
      color: 'secondary.main',
    },
  },
};

const NavLinks = () => {
  return (
    <AppBar position="static" elevation={1} sx={styles.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={styles.logoContainer}>
            <Link component={RouterLink} to="/" sx={styles.logoLink}>
              <img src={ravenLogo} alt="raven-logo" style={styles.logo} />
            </Link>
          </Box>

          <Box sx={styles.buttonsContainer}>
            <Button
              component={RouterLink}
              sx={styles.button}
              to="/login"
              variant="contained"
              color="secondary"
              id="nav-login"
            >
              Log In
            </Button>
            <Button
              component={RouterLink}
              sx={styles.button}
              to="/signup"
              variant="contained"
              color="secondary"
              id="nav-signup"
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavLinks;
