import * as React from 'react';
import PropTypes from 'prop-types';
import OlinLogo from '../../assets/olin-logo-beta.svg';

export class SidebarHeader extends React.Component {
  render() {
    return (
      <header className="header-content">
        <a onClick={this.props.homeClicked} alt="Home" title="Home"><OlinLogo className="olin-logo" /></a>
      </header>
    );
  }
}

// Define React prop types for type checking during development
SidebarHeader.propTypes = {
  homeClicked: PropTypes.func,
};
