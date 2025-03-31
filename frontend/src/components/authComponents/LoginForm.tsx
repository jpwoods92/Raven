import React, { useState, useEffect } from 'react';

import NavLinks from '../splash/NavComponent';

import { useLoginMutation } from '@/services/auth';

interface Form {
  password: string;
  username: string;
  errors: string[];
}

const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<Form>({
    password: '',
    username: '',
    errors: [],
  });

  const [login] = useLoginMutation();

  useEffect(() => {
    setFormState({
      username: '',
      password: '',
      errors: [],
    });
  }, []);

  const update = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = { ...formState };
    try {
      await login(user);
    } catch {
      setFormState((prev) => ({ ...prev, errors: ['Invalid username or password'] }));
    }
  };

  const errorElements = formState.errors.map((error, idx) => <li key={idx}>{error}</li>);
  let errorBox = null;
  if (errorElements.length) {
    errorBox = (
      <div className="errors-box">
        <ul id="error-messages">{errorElements}</ul>
      </div>
    );
  }

  return (
    <div className="login-form-div">
      <NavLinks />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-container">
          <h3 className="form-title">Welcome Back!</h3>
          <ul className="login-form-list">
            <li>
              <label className="email-input">
                Username
                <input
                  id="username-input"
                  type="text"
                  placeholder="username"
                  value={formState.username}
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
                  value={formState.password}
                  onChange={update('password')}
                />
              </label>
            </li>
            <li id="login-li">
              <button id="submit-input" type="submit">
                Login
              </button>
            </li>
          </ul>
        </div>
      </form>
      {errorBox}
    </div>
  );
};
export default LoginForm;
