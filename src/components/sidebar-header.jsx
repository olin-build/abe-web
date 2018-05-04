import * as React from 'react';
import PropTypes from 'prop-types';
import OlinLogo from '../../assets/olin-logo-beta.svg';

export const SidebarHeader = props => (
      <header className="header-content">
        <a onClick={props.homeClicked} alt="Home" title="Home"><OlinLogo className="olin-logo" /></a>
      </header>);

// Define React prop types for type checking during development
SidebarHeader.propTypes = {
  homeClicked: PropTypes.func.isRequired,
};
