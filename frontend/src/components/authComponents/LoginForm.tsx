import { Box, Typography, Button, Container, Paper, Alert, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { useState, useEffect } from 'react';
import { Link as ReactLink } from 'react-router-dom';

import { InputField } from '../common/InputField';
import AppBar from '../nav/AppBar';

import { loginFormStyles } from './LoginForm.styles';

import { useLoginMutation } from '@/services/auth';

interface Form {
  password: string;
  username: string;
}

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const styles = loginFormStyles(theme);

  const [formState, setFormState] = useState<Form>({
    password: '',
    username: '',
  });

  const [login, { error }] = useLoginMutation();

  useEffect(() => {
    setFormState({
      username: '',
      password: '',
    });
  }, []);

  const update = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = { ...formState };
    await login(user);
  };

  return (
    <>
      <AppBar />
      <Container sx={styles.container}>
        <Paper elevation={3} sx={styles.paper}>
          <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
            <Typography variant="h4" component="h3" gutterBottom sx={styles.title}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={styles.description}>
              Your friends are waiting for you. Jump back into the conversation and stay connected.
            </Typography>

            <Stack spacing={3}>
              <InputField
                id="username-input"
                label="Username"
                variant="outlined"
                fullWidth
                value={formState.username}
                onChange={update('username')}
              />

              <InputField
                id="password-input"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={formState.password}
                onChange={update('password')}
              />

              <Button
                id="submit-input"
                type="submit"
                variant="contained"
                fullWidth
                sx={styles.submitButton}
              >
                Login
              </Button>
              <Typography variant="body2" align="center" sx={styles.signupText}>
                New to Raven?{' '}
                <Link component={ReactLink} to="/signup" sx={styles.link}>
                  Sign up
                </Link>{' '}
                and start chatting with your friends in real-time.
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {error && (
          <Box sx={styles.errorContainer}>
            <Alert severity="error" sx={styles.errorAlert}>
              {((error as FetchBaseQueryError)?.data as { message?: string })?.message ||
                'An error occurred'}
            </Alert>
          </Box>
        )}
      </Container>
    </>
  );
};
export default LoginForm;
