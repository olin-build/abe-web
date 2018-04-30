// This component "wraps" sidebar panes in a standard header (for consistent UI)

import React from 'react';

export default class SidebarItemWrapper extends React.Component {
  render() {
    return (
      <div className={`sidebar-item ${this.props.className}`}>
        <div className="sidebar-item-header">
          {this.props.header}
        </div>
        <div className="sidebar-item-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
