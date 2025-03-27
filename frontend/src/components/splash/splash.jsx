import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import CallToAction from './call_to_action';
import MarketingComponent from './marketing';
import NavLinks from './nav_component';

class Splash extends React.Component {
  render() {
    return (
      <div className="body">
        <NavLinks />
        <CallToAction />
        <MarketingComponent />
      </div>
    );
  }
}

export default withRouter(Splash);
