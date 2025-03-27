import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions/session_actions';

import Splash from './splash';

const mapStateToProps = (state) => {
  return {
    currentUser: state.entities.users[state.session.currentUserId],
    loggedIn: !!state.session.currentUserId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
