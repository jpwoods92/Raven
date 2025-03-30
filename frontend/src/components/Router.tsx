import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App';
import LoginForm from './authComponents/LoginForm';
import SignupForm from './authComponents/SignupForm';
import Splash from './splash/Splash';

import { useAppSelector } from '@/store';

const Router = () => {
  const loggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <SignupForm />} />
        <Route path="/rooms/:id" element={!loggedIn ? <Navigate to="/" /> : <App />} />
        <Route path="/" element={<Splash />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
