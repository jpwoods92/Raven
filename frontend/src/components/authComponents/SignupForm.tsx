import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import NavLinks from '../splash/NavComponent';

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

  const update = (field: keyof UserFormData) => (e: ChangeEvent<HTMLInputElement>) => {
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

  const [signUp, { error }] = useRegisterMutation();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await signUp(formData);
  };

  const errorBox = error ? (
    <div className="errors-box-signup">
      <ul id="error-messages">
        <li>
          {('data' in error && (error.data as { message: string }).message) ||
            (error as Error).message}
        </li>
      </ul>
    </div>
  ) : null;

  return (
    <div className="signup-form-div">
      <NavLinks />
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form-container">
          <h3 className="form-title-signup">Welcome to Slackr!</h3>
          <ul className="signup-form-list">
            <li>
              <label className="email-input">
                Email
                <input
                  id="email-input"
                  type="text"
                  placeholder="your-name@email.com"
                  value={formData.email}
                  onChange={update('email')}
                  onBlur={() => {
                    setValidationErrors({
                      ...validationErrors,
                      email: validateEmail(formData.email),
                    });
                  }}
                  className={validationErrors.email ? 'input-error' : ''}
                />
                {validationErrors.email && (
                  <div className="validation-error">{validationErrors.email}</div>
                )}
              </label>
            </li>
            <li>
              <label className="username-input">
                Username
                <input
                  type="text"
                  id="username-input"
                  placeholder="your name"
                  value={formData.username}
                  onChange={update('username')}
                  onBlur={() => {
                    setValidationErrors({
                      ...validationErrors,
                      username: validateUsername(formData.username),
                    });
                  }}
                  className={validationErrors.username ? 'input-error' : ''}
                />
                {validationErrors.username && (
                  <div className="validation-error">{validationErrors.username}</div>
                )}
              </label>
            </li>
            <li>
              <label className="password-input">
                Password
                <input
                  type="password"
                  id="password-input"
                  placeholder="6 characters minimum"
                  value={formData.password}
                  onChange={update('password')}
                  onBlur={() => {
                    setValidationErrors({
                      ...validationErrors,
                      password: validatePassword(formData.password),
                    });
                  }}
                  className={validationErrors.password ? 'input-error' : ''}
                />
                {validationErrors.password && (
                  <div className="validation-error">{validationErrors.password}</div>
                )}
              </label>
            </li>
            <li id="submit-li">
              <button id="submit-input" type="submit">
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </form>
      {errorBox}
    </div>
  );
};
export default SignupForm;
