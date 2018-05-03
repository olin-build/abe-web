// This component is a button for hiding and showing the sidebar

import React from 'react';
import PropTypes from 'prop-types';
import MenuIconSVG from '../../assets/menu-icon.svg';

export default class MenuIconButton extends React.Component {
  render() {
    return (
      <button className="menu-icon-button" onClick={this.props.onClick} title={this.props.tooltip}>
        <MenuIconSVG />
      </button>
    );
  }
}

// Define React prop types for type checking during development
MenuIconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
