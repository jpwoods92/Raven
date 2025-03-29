import React, { Fragment } from 'react';

import App from './App';
import LoginForm from './authComponents/LoginForm';
import SignupForm from './authComponents/SignupForm';
import Splash from './splash/Splash';

import { AuthRoute, ProtectedRoute } from '@/util/routeUtil';

const Slackr = () => (
  <Fragment>
    <AuthRoute path="/login" component={LoginForm} />
    <AuthRoute path="/signup" component={SignupForm} />
    <ProtectedRoute path="/rooms/:id" component={App} />
    <AuthRoute path="/" component={Splash} />
  </Fragment>
);

export default Slackr;
