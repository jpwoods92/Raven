import { Box, Typography, Container, Paper, Alert, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { useState, useEffect } from 'react';
import { Link as ReactLink } from 'react-router-dom';

import { AppButton } from '../common/AppButton';
import { InputField } from '../common/InputField';
import AppBar from '../nav/AppBar';

import { signupFormStyles } from './SignupForm.styles';

import { useRegisterMutation } from '@/services/auth';

interface UserFormData {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username: string;
  email: string;
  password: string;
}

const DEFAULT_FORM_STATE = {
  username: '',
  displayName: '',
  email: '',
  password: '',
};

const DEFAULT_VALIDATION_STATE = {
  username: '',
  email: '',
  password: '',
};

const SignupForm: React.FC = () => {
  const theme = useTheme();
  const styles = signupFormStyles(theme);

  const [formData, setFormData] = useState<UserFormData>(DEFAULT_FORM_STATE);

  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(DEFAULT_VALIDATION_STATE);

  const [register, { error }] = useRegisterMutation();

  useEffect(() => {
    setFormData(DEFAULT_FORM_STATE);
    setValidationErrors(DEFAULT_VALIDATION_STATE);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!password) return 'Password is required';
    if (password.length < 10) return 'Password must be at least 10 characters long';
    if (!passwordRegex.test(password))
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
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
  const errorMessages = ((error as FetchBaseQueryError)?.data as { message: string | string[] })
    ?.message;

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
                id="displayName-input"
                label="Display Name (Optional)"
                variant="outlined"
                fullWidth
                value={formData.displayName}
                onChange={update('displayName')}
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

              <AppButton
                id="submit-input"
                type="submit"
                variant="contained"
                fullWidth
                sx={styles.submitButton}
              >
                Sign Up
              </AppButton>
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

        {errorMessages && (
          <Box sx={styles.errorContainer}>
            {Array.isArray(errorMessages) ? (
              errorMessages.map((error, idx) => (
                <Alert key={idx} severity="error" sx={styles.errorAlert}>
                  {error}
                </Alert>
              ))
            ) : (
              <Alert severity="error" sx={styles.errorAlert}>
                {errorMessages}
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};

export default SignupForm;
