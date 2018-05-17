// This page displays the calendar (it's the home page)

import * as React from 'react';
import UltraResponsiveCalendar from 'ultra-responsive-calendar';
import SidebarModes from '../../data/sidebar-modes';
import CalendarHeader from './calendar-header';

const normalizeLabelName = name => name.replace(/[- ]/g, '').toLowerCase();

/** labelsParam is a string of comma-separated label names. Given a list of label
 * names in allLabels, return a list of label names from labelsParam. Labels are
 * changed to match the case of allLabels.
 */
export function normalizeUrlLabels(labelsParam, allLabels) {
  const allLabelNames = Object.keys(allLabels);
  const map = new Map(allLabelNames.map(name => [normalizeLabelName(name), name]));
  // The literal names take precedence over normalized names. This assures that
  // if allLabels contains both "Label" and "label", the former isn't turned
  // into the latter.
  allLabelNames.forEach((name) => {
    map.set(name, name);
  });
  return labelsParam
    .split(',')
    .map(name => map.get(normalizeLabelName(name)))
    .filter(name => name)
    .sort();
}

export default class CalendarPage extends React.Component {
  componentDidMount() {
    this.props.setSidebarMode(SidebarModes.CALENDAR_VIEW);
    this.props.setPageTitlePrefix(null);

    // Load the visible labels from the URL (if defined)
    const labelsStr = this.props.match.params.labels;
    if (labelsStr && labelsStr.length > 0) {
      this.props.setVisibleLabels(normalizeUrlLabels(labelsStr, this.props.labels.labelList));
    }

    if (!this.props.currentlyViewingDate) {
      // Set the focused date on the calendar to today and load the events
      this.props.showToday();
    }
  }

  componentDidUpdate() {
    if (this.props.labels.visibleLabels) {
      const labelsStr = this.props.labels.visibleLabels
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
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
