import React from 'react';
import { Link } from 'react-router-dom';

import slackrLogo from '@/assets/slackr.svg';

const NavLinks = () => {
  let nav = (
    <ul className="nav-list">
      <li>
        <Link id="nav-login" to="/login">
          Log In
        </Link>
      </li>
      <li>
        <Link id="nav-signup" to="/signup">
          Sign Up
        </Link>
      </li>
    </ul>
  );

  return (
    <header className="nav-bar">
      <Link id="nav-logo-link" to="/">
        <img src={slackrLogo} alt="slackr-logo" />
      </Link>
      {nav}
    </header>
  );
};

export default NavLinks;
