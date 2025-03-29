import React from 'react';

import CallToAction from './CallToAction';
import MarketingComponent from './Marketing';
import NavLinks from './NavComponent';

const Splash = () => {
  return (
    <div className="body">
      <NavLinks />
      <CallToAction />
      <MarketingComponent />
    </div>
  );
};

export default Splash;
