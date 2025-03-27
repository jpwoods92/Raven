import React, { Fragment } from 'react';

import { AuthRoute, ProtectedRoute } from '../util/route_util';

import App from './App';
import LoginFormContainer from './auth_components/login_form_container';
import SignupFormContainer from './auth_components/signup_form_container';
import SplashContainer from './splash/splash_container';

const Slackr = () => (
  <Fragment>
    <AuthRoute path="/login" component={LoginFormContainer} />
    <AuthRoute path="/signup" component={SignupFormContainer} />
    <ProtectedRoute path="/rooms/:id" component={App} />
    <AuthRoute exact path="/" component={SplashContainer} />
  </Fragment>
);

export default Slackr;
