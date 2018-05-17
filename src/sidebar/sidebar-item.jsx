// This component "wraps" sidebar panes in a standard header (for consistent UI)

import PropTypes from 'prop-types';
import React from 'react';

const SidebarItemWrapper = props => (
  <div className="sidebar-item">
    <div className="sidebar-item-header">{props.header}</div>
    <div className="sidebar-item-content">{props.children}</div>
  </div>
);

SidebarItemWrapper.propTypes = {
  header: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default SidebarItemWrapper;
