/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';

import { useAppSelector } from '@/store';

interface AuthRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<any>;
  path: string;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component, path }) => {
  const loggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  const toRender = (props: any) => {
    if (!loggedIn) {
      return <Component {...props} />;
    } else {
      return <Navigate to="/" />;
    }
  };
  return <Route path={path} element={toRender({})} />;
};

export const ProtectedRoute: React.FC<AuthRouteProps> = ({ component: Component, path }) => {
  const loggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  const toRender = (props: any) => {
    if (!loggedIn) {
      return <Navigate to="/" />;
    } else {
      return <Component {...props} />;
    }
  };

  return <Route path={path} element={toRender({})} />;
};
