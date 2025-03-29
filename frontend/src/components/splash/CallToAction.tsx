import React from 'react';
import { Link } from 'react-router-dom';

import workImg from '@/assets/work_img.png';

const CallToAction = () => {
  return (
    <div className="call-to-action-card">
      <div className="content">
        <img id="work-img" alt="slackr-work-img" src={workImg} />
        <div className="call-to-action-body">
          <h2 id="call-to-action-title">Where Work Happens</h2>
          <p id="call-to-action-body-text">
            When your team needs to slack off during a project, fire a new employee, deploy some bad
            code, finalize next year&apos;s debt, plan your next office downsizing, and more, Slackr
            has you covered.
          </p>
          <Link id="get-started-button" to="/signup">
            GET STARTED
          </Link>
          <p id="sign-in-text">
            Already using Slack?{' '}
            <Link id="sign-in-link" to="/login">
              Sign in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
