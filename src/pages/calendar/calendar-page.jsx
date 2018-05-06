// This page displays the calendar (it's the home page)

import * as React from 'react';
import UltraResponsiveCalendar from 'ultra-responsive-calendar';
import SidebarModes from '../../data/sidebar-modes';
import CalendarHeader from './calendar-header';

export default class CalendarPage extends React.Component {
  componentDidMount() {
    this.props.setSidebarMode(SidebarModes.CALENDAR_VIEW);
    this.props.setPageTitlePrefix(null);

    // Load the visible labels from the URL (if defined)
    const labelsStr = this.props.match.params.labels;
    if (labelsStr && labelsStr.length > 0) {
      const labelsArr = labelsStr.split(',').sort();
      this.props.setVisibleLabels(labelsArr);
    }

    if (!this.props.currentlyViewingDate) {
      // Set the focused date on the calendar to today and load the events
      this.props.showToday();
    }
  }

  componentDidUpdate() {
    if (this.props.labels.visibleLabels) {
      const labelsStr = this.props.labels.visibleLabels
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) // sort alphabetically ignoring case
        .join(',');
      const url = `/calendar/${labelsStr}`;
      if (url !== this.props.location.pathname) {
        // Update URL to reflect selected labels
        this.props.setRoute(encodeURI(url));
      }
    }
  }

  render() {
    const currDate = this.props.currentlyViewingDate
      ? this.props.currentlyViewingDate.format('MMMM D, YYYY')
      : '';

    return (
      <div className="calendar-container">
        <CalendarHeader
          title={currDate}
          onLeftClick={this.props.pageLeft}
          onRightClick={this.props.pageRight}
          onTodayClick={this.props.showToday}
          {...this.props}
        />
        <UltraResponsiveCalendar
          id="calendar"
          className="page-container calendar-container"
          viewType={this.props.currentViewMode.calendarModeProp}
          days={this.props.currentViewMode.daysVisible}
          startDate={this.props.currentlyViewingDate}
          onEventClick={this.props.viewEvent}
          {...this.props}
        />
      </div>
    );
  }
}
