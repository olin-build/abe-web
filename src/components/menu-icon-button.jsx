// This component is a button for hiding and showing the sidebar

import PropTypes from 'prop-types';
import React from 'react';
import MenuIconSVG from '../../assets/menu-icon.svg';

const MenuIconButton = props => (
  <button className="menu-icon-button" onClick={props.onClick} title={props.tooltip}>
    <MenuIconSVG />
  </button>
);

// Define React prop types for type checking during development
MenuIconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MenuIconButton;
