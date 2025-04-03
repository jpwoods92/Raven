import { Box, Typography, Button, Container, Paper, Alert, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { Link as ReactLink } from 'react-router-dom';

import { InputField } from '../common/InputField';
import AppBar from '../nav/AppBar';

import { signupFormStyles } from './SignupForm.styles';

import { useRegisterMutation } from '@/services/auth';

interface UserFormData {
  username: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const theme = useTheme();
  const styles = signupFormStyles(theme);

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: '',
    email: '',
    password: '',
  });

  const [register, { error }] = useRegisterMutation();

  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
    });
    setValidationErrors({
      username: '',
      email: '',
      password: '',
    });
  }, []);

  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    return '';
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const update = (field: keyof UserFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });

    setValidationErrors({
      ...validationErrors,
      [field]: '',
    });
  };

  const validateForm = (): boolean => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setValidationErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
    });

    return !usernameError && !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await register(formData);
  };

  // Extract error messages from RTK Query error
  const errorMessages = error
    ? [
        'data' in error && (error.data as { message: string }).message
          ? [(error.data as { message: string }).message]
          : [(error as Error).message],
      ]
    : [];

  return (
    <>
      <AppBar />
      <Container sx={styles.container}>
        <Paper elevation={3} sx={styles.paper}>
          <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
            <Typography variant="h4" component="h3" gutterBottom sx={styles.title}>
              Welcome to Raven!
            </Typography>
            <Typography variant="body1" sx={styles.description}>
              Join our community and start connecting with friends and colleagues in real-time.
            </Typography>

            <Stack spacing={3}>
              <InputField
                id="email-input"
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={update('email')}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                onBlur={() => {
                  setValidationErrors({
                    ...validationErrors,
                    email: validateEmail(formData.email),
                  });
                }}
              />

              <InputField
                id="username-input"
                label="Username"
                variant="outlined"
                fullWidth
                value={formData.username}
                onChange={update('username')}
                error={!!validationErrors.username}
                helperText={validationErrors.username}
                onBlur={() => {
                  setValidationErrors({
                    ...validationErrors,
                    username: validateUsername(formData.username),
                  });
                }}
              />

              <InputField
                id="password-input"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={formData.password}
                onChange={update('password')}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                onBlur={() => {
                  setValidationErrors({
                    ...validationErrors,
                    password: validatePassword(formData.password),
                  });
                }}
              />

              <Button
                id="submit-input"
                type="submit"
                variant="contained"
                fullWidth
                sx={styles.submitButton}
              >
                Sign Up
              </Button>
              <Typography variant="body2" align="center" sx={styles.loginText}>
                Already have an account?{' '}
                <Link component={ReactLink} to="/login" sx={styles.link}>
                  Login
                </Link>{' '}
                and reconnect with your team.
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {errorMessages.length > 0 && (
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

export default SignupForm;
