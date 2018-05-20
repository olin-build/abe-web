// This container is a sort of middleware between the React page and the Redux data store

import _ from 'lodash';
import { connect } from 'react-redux';
import {
  page,
  setPageTitlePrefix,
  setRoute,
  setSidebarMode,
  setViewMode,
  setVisibleLabels,
  showToday,
  toggleSidebarCollapsed,
  viewEvent,
} from '../data/actions';
import CalendarPage from '../pages/calendar/calendar-page';
import withServerData from './with-server-data';

export const getVisibleEvents = (events, visibleLabels, allLabels) => {
  // Filter out events that are not labeled with currently visible labels
  if (!events || !visibleLabels || !allLabels) return null;
  const visibleLabelSet = new Set(visibleLabels);
  const firstVisibleLabel = event => event.labels.find(name => visibleLabelSet.has(name));
  return Object.values(events)
    .filter(event => firstVisibleLabel(event))
    .map(event =>
      _.merge({}, event, {
        color: allLabels[firstVisibleLabel(event)].color,
        id: event.id || event.sid, // Make sure all events have an id attribute
      }));
};

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => ({
  user: state.user,
  events: getVisibleEvents(state.events.events, state.labels.visibleLabels, state.labels.labelList),
  labels: state.labels,
  ...state.calendar,
});

// This function passes functions from /srcs/data/actions.jsx to the React component as props
const mapDispatchToProps = dispatch => ({
  setSidebarMode: (mode) => {
    dispatch(setSidebarMode(mode));
  },
  viewEvent: (event) => {
    dispatch(viewEvent(event));
  },
  toggleSidebarCollapsed: () => {
    dispatch(toggleSidebarCollapsed());
  },
  setVisibleLabels: (labels) => {
    dispatch(setVisibleLabels(labels));
  },
  setPageTitlePrefix: (title) => {
    dispatch(setPageTitlePrefix(title));
  },
  setRoute(route) {
    dispatch(setRoute(route));
  },
  pageLeft: () => {
    dispatch(page(-1));
  },
  pageRight: () => {
    dispatch(page(1));
  },
  showToday: () => {
    dispatch(showToday());
  },
  setViewMode: (mode) => {
    dispatch(setViewMode(mode));
  },
});

// Connect props to Redux state and actions
const GuardedCalendarPage = withServerData(CalendarPage);
const CalendarContainer = connect(mapStateToProps, mapDispatchToProps)(GuardedCalendarPage);

export default CalendarContainer;
