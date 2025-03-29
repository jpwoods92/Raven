import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import NavLinks from '../splash/NavComponent';

import { useRegisterMutation } from '@/services/auth';

interface UserFormData {
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

  useEffect(() => {
    setFormData({
      ...formData,
      email: '',
      password: '',
    });
  }, [formData]);

  const update = (field: keyof UserFormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const [signUp, { error }] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                />
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
                />
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
                />
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
