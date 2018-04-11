// This component is displayed at the top of the calendar

import React from 'react';

export default class CalendarHeader extends React.Component {

  render() {
    const viewOptions = Object.values(this.props.possibleViewModes).map((mode) => {
      const className = 'calendar-header-view-option'
        + (mode === this.props.currentViewMode ? ' current' : '');
      return (
        <div
          key={mode.displayName}
          className={className}
          onClick={() => this.props.setViewMode(mode)}
        >
          {mode.displayName}
        </div>
      );
    });

    return (
      <div className="calendar-header">
        <span className="title">{this.props.title}</span>
        <div className="calendar-header-options">
          <div className="calendar-header-view-selector">
            {viewOptions}
          </div>
          <div className="calendar-header-pagination">
            <button onClick={this.props.onLeftClick}>&lt;</button>
            <button onClick={this.props.onTodayClick}>Today</button>
            <button onClick={this.props.onRightClick}>&gt;</button>
          </div>
        </div>
      </div>
    )
  }
}
