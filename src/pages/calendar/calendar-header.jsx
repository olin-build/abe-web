// This component is displayed at the top of the calendar

import React from 'react';
import MenuIconButton from '../../components/menu-icon-button';

const CalendarHeader = (props) => {
  const viewOptions = Object.values(props.possibleViewModes).map((mode) => {
    const className = `calendar-header-view-option${
      mode === props.currentViewMode ? ' current' : ''
    }`;
    return (
      <div key={mode.displayName} className={className} onClick={() => props.setViewMode(mode)}>
        {mode.displayName}
      </div>
    );
  });

  return (
    <div className="calendar-header">
      <MenuIconButton onClick={props.toggleSidebarCollapsed} />
      <span className="title">{props.title}</span>
      <div className="calendar-header-options">
        <div className="calendar-header-view-selector">{viewOptions}</div>
        <div className="calendar-header-pagination">
          <button onClick={props.onLeftClick}>&lt;</button>
          <button onClick={props.onTodayClick}>Today</button>
          <button onClick={props.onRightClick}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
