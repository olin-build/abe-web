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

const CalendarPage = (props) => {
  // The function passed to the useEffect hook runs once when the component first renders and then
  // once every time the dependency array changes. Since the array will always be [], it will only
  // run once.
  React.useEffect(() => {
    props.setSidebarMode(SidebarModes.CALENDAR_VIEW);
    props.setPageTitlePrefix(null);

    // Load the visible labels from the URL (if defined)
    const labelsStr = props.match.params.labels;
    if (labelsStr && labelsStr.length > 0) {
      props.setVisibleLabels(normalizeUrlLabels(labelsStr, props.labels.labelList));
    }

    if (!props.currentlyViewingDate) {
      // Set the focused date on the calendar to today and load the events
      props.showToday();
    }
  }, []);

  // The function passed to this useEffect hook will run when the component first mounts and then
  // again every time props.labels.visibleLabels changes.
  React.useEffect(() => {
    if (props.labels.visibleLabels) {
      const labelsStr = props.labels.visibleLabels
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .join(',');
      const url = `/calendar/${labelsStr}`;
      if (url !== props.location.pathname) {
        // Update URL to reflect selected labels
        props.setRoute(encodeURI(url));
      }
    }
  }, [props.labels.visibleLabels]);

  const currDate = props.currentlyViewingDate
    ? props.currentlyViewingDate.format('MMMM D, YYYY')
    : '';

  return (
    <div className="calendar-container">
      <CalendarHeader
        title={currDate}
        onLeftClick={props.pageLeft}
        onRightClick={props.pageRight}
        onTodayClick={props.showToday}
        {...props}
      />
      <UltraResponsiveCalendar
        id="calendar"
        className="page-container calendar-container"
        viewType={props.currentViewMode.calendarModeProp}
        days={props.currentViewMode.daysVisible}
        startDate={props.currentlyViewingDate}
        onEventClick={props.viewEvent}
        {...props}
      />
    </div>
  );
};

export default CalendarPage;
