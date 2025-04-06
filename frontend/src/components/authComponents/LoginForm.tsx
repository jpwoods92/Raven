import { Box, Typography, Container, Paper, Alert, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { useState, useEffect } from 'react';
import { Link as ReactLink } from 'react-router-dom';

import { AppButton } from '../common/AppButton';
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
    await login(user).unwrap();
  };

  // Extract error messages from RTK Query error
  const errorMessages = ((error as FetchBaseQueryError)?.data as { message: string[] })?.message;

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

              <AppButton
                id="submit-input"
                type="submit"
                variant="contained"
                fullWidth
                sx={styles.submitButton}
              >
                Login
              </AppButton>
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

        {errorMessages?.length > 0 && (
          <Box sx={styles.errorContainer}>
            {errorMessages.map((error, idx) => (
              <Alert key={idx} severity="error" sx={styles.errorAlert}>
                {error}
              </Alert>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};
export default LoginForm;
