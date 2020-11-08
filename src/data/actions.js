// This file contains a bunch of Redux actions

import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import ReactGA from 'react-ga';
import { push } from 'react-router-redux';
import { getAccessToken, setAccessTokenFromResponse } from './auth';
import apiClient from './client';
import { decodeEvent } from './encoding';
import { TOKEN_INFO_ENDPOINT } from './settings';

/* eslint-disable max-len */
export const ActionTypes = {
  // General UI
  DISPLAY_ERROR: 'DISPLAY_ERROR', // Displays an error message (red background) at the top of the screen TODO: Issue #54
  DISPLAY_MESSAGE: 'DISPLAY_MESSAGE', // Displays a message at the top of the screen TODO: Issue #54
  SET_PAGE_TITLE_PREFIX: 'SET_PAGE_TITLE_PREFIX', // Sets the prefix of the page title (before the app name)
  SET_SIDEBAR_PANE_VISIBILITY: 'SET_SIDEBAR_PANE_VISIBILITY', // Sets which components are visible in the sidebar
  SET_SIDEBAR_MODE: 'SET_SIDEBAR_MODE', // Sets which components are visible in the sidebar based on a layout template
  TOGGLE_SIDEBAR_VISIBILITY: 'TOGGLE_SIDEBAR_VISIBILITY', // Toggles the visibility of the app sidebar
  // Calendar view
  SET_FOCUSED_DATE: 'SET_FOCUSED_DATE', // Sets the day the calendar view is ensuring is shown (changing this changes
  // which time period is shown on the calendar)
  SET_FILTER_LABELS: 'SET_FILTER_LABELS', // Sets which labels are selected as part of the event filter
  FILTER_LABEL_TOGGLED: 'FILTER_LABEL_TOGGLED', // Toggles whether or not a specific label is selected as part
  // of the event filter
  SET_FILTER_LABEL_SELECTED: 'SET_FILTER_LABEL_SELECTED', // Sets whether or not a specific label is selected as part
  // of the event filter
  SET_VIEW_MODE: 'SET_VIEW_MODE', // Sets which view mode (month, week, day, etc) the calendar is in
  SET_ACCESS_INFO: 'SET_ACCESS_INFO',
  // Event data
  SET_CURRENT_EVENT: 'SET_CURRENT_EVENT', // Keeps track of the data for the event currently being viewed or edited
  FETCH_EVENTS_IF_NEEDED: 'FETCH_EVENTS_IF_NEEDED', // Triggers FETCH_EVENTS if no event data is loaded
  FETCH_EVENTS: 'FETCH_EVENTS', // Fetches event data from the server
  SET_EVENTS: 'SET_EVENTS', // Sets the event data using data from a server response
  // Editing an event
  CLEAR_CURRENT_EVENT: 'CLEAR_CURRENT_EVENT',
  // Labels
  FETCH_LABELS: 'FETCH_LABELS', // Fetches all labels and their data from the server
  FETCH_LABELS_IF_NEEDED: 'FETCH_LABELS_IF_NEEDED', // Calls FETCH_LABELS if no label data is loaded
  SET_LABELS: 'SET_LABELS', // Sets the label data using data from a server response
  // ICS
  GENERATE_ICS_FEED: 'GENERATE_ICS_FEED', // Triggers generation of an ICS feed with current filter applied and copies
  // URL to clipboard
};
/* eslint-emable max-len */

// Sections:
//   General UI actions
//   Navigation actions
//   Calendar view actions
//     Temporal navigation
//     View mode
//   Event data actions
//   Labels actions

// ########## Begin General UI Actions ########## //

// ----- Begin notification/message bar actions ----- // TODO: Issue #54

/**
 * Display a message at the top of the window in a notification bar TODO: Issue #54
 */
export function displayMessage(message) {
  return { type: ActionTypes.DISPLAY_MESSAGE, message };
}

/**
 * Display an error message (red background) at the top of the window in a
 * notification bar TODO: Issue #54
 */
export function displayError(error, message) {
  return { type: ActionTypes.DISPLAY_ERROR, error, message };
}

export function clearMessages() {
  return { type: ActionTypes.CLEAR_MESSAGES };
}

// ----- End notification/message bar actions ----- //

// ----- Begin sidebar actions ----- //

/**
 * Sets the display mode (i.e. which panes are visible).
 * @param {object} mode - one of the modes defined in /src/data/sidebar-modes.js
 */
export function setSidebarMode(mode) {
  return { type: ActionTypes.SET_SIDEBAR_MODE, mode };
}

/**
 * Toggles the visibility of the app sidebar.
 */
export function toggleSidebarCollapsed() {
  return (dispatch, getState) => {
    const action = getState().sidebar.isCollapsed ? 'expand' : 'collapse';
    ReactGA.event({
      category: 'Sidebar',
      action,
      label: 'User toggled the visibility of the sidebar',
    });
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR_VISIBILITY });
  };
}

// ----- End sidebar actions ----- //

// ----- Begin miscellaneous UI actions ----- //

export function navigateHome() {
  return push('/');
}

/**
 * Sets the page title prefix (what's displayed before the cross-site app name suffix)
 * @param {string} newTitle - the title
 */
export function setPageTitlePrefix(newTitle) {
  return (dispatch, getState) => {
    let fullTitle;
    const { pageTitleSuffix } = getState().general;
    if (!newTitle || newTitle.length === 0) {
      fullTitle = pageTitleSuffix;
    } else if (newTitle.length > 50) {
      fullTitle = `${newTitle.substring(0, 50)}... | ${pageTitleSuffix}`;
    } else {
      fullTitle = `${newTitle} | ${pageTitleSuffix}`;
    }
    dispatch({ type: ActionTypes.SET_PAGE_TITLE_PREFIX, title: fullTitle });
  };
}

// ----- End miscellaneous UI actions ----- //

// ########## End General UI Actions ########## //

// ########## Begin Navigation Actions ########## //

/**
 * Sets the page route (URL suffix).
 * @param {string} route - the URL suffix to use ('/calendar/', '/view/<event_id>', etc)
 */
export function setRoute(route) {
  return (dispatch) => {
    dispatch(push(route));
  };
}

// ########## End Navigation Actions ########## //

// ########## Begin Calendar View Actions ########## //

// ----- Begin temporal nav of calendar ----- //

/** Pages forward or backward (next week, prev week, next month, prev month, etc) */
export function page(direction) {
  return (dispatch, getState) => {
    const state = getState();
    const delta = getPageDelta(state);
    const newDate = moment(state.calendar.currentlyViewingDate).add(direction * delta[0], delta[1]);
    dispatch(setCurrentlyViewingDate(newDate));
  };
}

/**
 * Calculates how many of what unit (3 days, 1 week, etc) the currently viewing
 * date should be changed by, based on what display mode (month, week, day, etc)
 * the calendar is in.
 */
function getPageDelta(state) {
  return state.calendar.currentViewMode.daysVisible > 0
    ? [state.calendar.currentViewMode.daysVisible, 'd']
    : [1, 'M'];// daysVisible = -1 in month view
}


export function showToday() {
  return (dispatch, getStore) => {
    const focusDate = moment().local();
    const state = getStore();
    const inWeekView = state.calendar.currentViewMode.daysVisible === 7;
    if (inWeekView) {
      focusDate.day(0);// Displays the first day of the week view as Sunday
    }
    dispatch(setCurrentlyViewingDate(focusDate));
  };
}

/**
 * Sets the date the calendar should be "centered" around
 * @param {Moment} date - the first day to show in a multi-day view, or to be
 *  used to determine the week or month to show in a week or month view, etc.
 */
export function setCurrentlyViewingDate(date) {
  // Set the first date visible on the calendar
  date
    .hour(0)
    .minute(0)
    .second(0); // Set to start of day to avoid any potential weirdness when manipulating later
  // TODO: Cache request responses (so don't need to make request on every page change)

  return (dispatch) => {
    // Find the first day of the first week of the month
    const firstDay = moment(date)
      .date(0)
      .day(0);
    // Find the last day of the last week of the month
    const lastDay = moment(date)
      .date(1)
      .add(1, 'M')
      .subtract(1, 'd')
      .day(7);
    dispatch(refreshEvents(firstDay, lastDay));
    dispatch({ type: ActionTypes.SET_FOCUSED_DATE, data: date });
  };
}

// ----- End temporal nav of calendar ------ //

// ----- Begin calendar view mode ----- //

/** Sets which view format to display the calendar in (month, week, day, etc) */
export function setViewMode(mode) {
  return (dispatch, getStore) => {
    const state = getStore();
    if (mode === state.calendar.possibleViewModes.Week) {
      const firstOfWeek = moment(state.calendar.currentlyViewingDate).day(0);
      dispatch({ type: ActionTypes.SET_FOCUSED_DATE, data: firstOfWeek });
    }
    dispatch({ type: ActionTypes.SET_VIEW_MODE, data: mode });
  };
}

// ----- End calendar view mode ----- //

// ########## End Calendar View Actions ########## //

/**
 * Performs a server request to refresh the user info.
 */
export function fetchAccessInfo() {
  function setAccessInfo(user) {
    const token = user.token || {};
    // TODO: remove support for string array scope
    const { scope } = user;
    const scopes = _.isString(scope) ? user.scope.split(' ') : scope;
    const data = {
      authenticated: token.active,
      scope: new Set(scopes),
    };
    return { type: ActionTypes.SET_ACCESS_INFO, data };
  }
  const token = getAccessToken();
  return token
    ? dispatch =>
      axios
        .get(TOKEN_INFO_ENDPOINT, { params: { token } })
        .then(setAccessTokenFromResponse)
        .then(response => response.data, error => dispatch(displayError(error)))
        .then(user => dispatch(setAccessInfo(user)))
    : dispatch => dispatch(setAccessInfo({}));
}

// ########## Begin Event Data Actions ########## //

// ----- Begin general event actions ----- //

/**
 * Sets the current event so that the entire app can know what's being viewed or
 * edited (esp. the sidebar)
 *
 * @param {string} id: the ID or SID (series ID?) of the event
 * @param {string|null} recId: the date of the recurrence instance (YYYYDDD), if
 * applicable
 */
export function setCurrentEventById(id, recId) {
  return (dispatch, getStore) => {
    // Try to get the event from our cache
    const store = getStore();
    const eventKey = recId ? `${id}${recId}` : id;
    const eventData = store.events.events ? store.events.events[eventKey] : null;

    // Make sure we have the event data
    if (eventData) {
      dispatch(setCurrentEventData(eventData));
    } else {
      // We don't have the data, so request it from the server
      const url = recId ? `/events/${id}/${recId}` : `/events/${id}`;
      apiClient
        .get(url)
        .then(({ data }) => dispatch(setCurrentEventData(data)))
        .catch(response => console.error(response)); // TODO: Display an error message to the user
    }
  };
}

export function setCurrentEventData(data) {
  return { type: ActionTypes.SET_CURRENT_EVENT, data: decodeEvent(data) };
}

export function getEventDataViaUrlParams(urlParams) {
  return setCurrentEventById(urlParams.id || urlParams.sid, urlParams.recId);
}

export function clearCurrentEvent() {
  return { type: ActionTypes.CLEAR_CURRENT_EVENT };
}

/**
 * Fetches events for the given period.
 * @param {Moment} start - the first day to fetch events for
 * @param {Moment} end - the last day to fetch events for
 */
export function refreshEvents(start, end) {
  return (dispatch) => {
    const startString = `${start.year()}-${start.month() + 1}-${start.date()}`;
    const endString = `${end.year()}-${end.month() + 1}-${end.date()}`;
    return apiClient.get(`/events/?start=${startString}&end=${endString}`).then(({ data }) => {
      const events = data.map(decodeEvent);
      dispatch(setEvents(events));
    });
  };
}

// FIXME: This is a bit of a hack to trigger a refresh. It should be replaced by
// some sort of cache invalidation call.
export function refreshEventsForCurrentViewWindow() {
  return (dispatch, getStore) => {
    const { currentlyViewingDate } = getStore().calendar;
    dispatch(setCurrentlyViewingDate(currentlyViewingDate));
  };
}

/**
 * Saves the event data received from the server to the Redux store.
 * @param {object} events - the event data
 */
export function setEvents(events) {
  return (dispatch) => {
    const res = {};
    events.forEach((event) => {
      // Resolve unique ID for single-occurrence event or recurring event occurrence
      const eventKey = event.id || event.sid + event.start.format('YYYYDDD');
      res[eventKey] = event;
    });
    dispatch({ type: ActionTypes.SET_EVENTS, data: res });
  };
}

// ----- End general event actions ----- //

// ----- Begin editing event actions ----- //

/**
 * Triggers switching to the event edit page.
 * Note: store.events.current must be set before calling this to edit an existing event.
 */
export function editCurrentEvent() {
  return (dispatch, getStore) => {
    const store = getStore();
    const event = store.events.current;
    const linkSuffix = event.recId ? `${event.id || event.sid}/${event.recId}` : event.id;
    const path = `/edit/${linkSuffix}`;
    dispatch(push(path));
  };
}

/**
 * Triggers switching to the event edit page.
 * Note: store.events.current must be set before calling this to edit an existing event.
 */
export function editCurrentEventSeries() {
  return (dispatch, getStore) => {
    const store = getStore();
    const event = store.events.current;
    const path = `/edit/${event.id || event.sid}`;
    dispatch(push(path));
  };
}

export function deleteCurrentEvent() {
  return (dispatch, getStore) => {
    const store = getStore();
    const event = store.events.current;
    apiClient
      .delete(`/events/${event.id || event.sid}`)
      .catch(response => eventDeleteFailed(event, response))
      .then(() => dispatch(eventDeletedSuccessfully(event.id || event.sid)));
  };
}

/**
 * Called when the server returns a success status code in response to a save request.
 * @param {object} event - the saved event
 */
export function eventSavedSuccessfully(event) {
  return (dispatch) => {
    let label;
    let action = 'update success';
    if (event.recId) {
      label = `Event ${event.id || event.sid}/${event.recId} saved successfully`;
    } else if (event.id || event.sid) {
      label = `Event ${event.id || event.sid} saved successfully`;
    } else {
      label = 'Event created successfully';
      action = 'create success';
    }
    ReactGA.event({
      category: 'Event Save',
      action,
      label,
    });
    dispatch(refreshEventsForCurrentViewWindow());
    dispatch(push('/'));
  };
}

/**
 * Called when the server returns a failure status code in response to a save request.
 * @param {object} eventData - the event data that we attempted to save
 * @param {object} error - information about the error
 */
export function eventSaveFailed(eventData, error) {
  let label;
  let action = 'update failure';
  if (eventData.id) {
    label = `Event ${eventData.id} save attempt unsuccessful`;
  } else if (eventData.sid) {
    label = `Event ${eventData.sid}/${eventData.recId} save attempt unsuccessful`;
  } else {
    label = 'New event save attempt unsuccessful';
    action = 'create failure';
  }
  ReactGA.event({
    category: 'Event Save',
    action,
    label,
  });
  alert(`Saving event failed:\n${error}`);
}

// ----- End event editing actions ----- //

// ----- Begin deleting event actions ----- //
/**
 * Called when the server returns a success status code in response to a delete request.
 * @param {object} eventId - the ID of the deleted event
 */
export function eventDeletedSuccessfully(eventId) {
  return (dispatch) => {
    ReactGA.event({
      category: 'Event Delete',
      action: 'success',
      label: `Event ${eventId} deleted successfully`,
    });
    dispatch(refreshEventsForCurrentViewWindow());
    dispatch(navigateHome());
  };
}

/**
 * Called when an attempted event deletion failed.
 * @param {object} event - the event that we attempted to delete
 * @param {object} error - information about the error that occurred
 */
export function eventDeleteFailed(event, error) {
  ReactGA.event({
    category: 'Event Delete',
    action: 'failure',
    label: `Event ${event.id || event.sid} ${event.recId || ''} delete attempt unsuccessful`,
  });
  alert(`Delete event failed:\n${error}`);
}

// ----- Begin event viewing actions ----- //

/**
 * Triggers showing the event details page.
 *
 * This function adds a `recId` property to the event.
 *
 * @param {object} event - the event data of the event to view
 */
export function viewEvent(event) {
  return (dispatch) => {
    if (event.sid && !event.recId) {
      event.recId = event.start.format('YYYY-MM-DD'); // ISO 8601 date format
    }
    const linkSuffix = event.id || `${event.sid}/${event.recId}`;
    const path = `/view/${linkSuffix}`;
    dispatch(setCurrentEventData(event));
    dispatch(push(path));
  };
}

// ----- End event viewing actions ----- //

// ########## End Event Data Actions ########## //

// ########## Begin Labels-Related Actions ########## //

/**
 * Updates the label list in the Redux store (if it is empty) by fetching it from the server.
 */
export function refreshLabelsIfNeeded() {
  return (dispatch, getState) => {
    if (!getState().labels.labelList) {
      dispatch(fetchLabels());
    }
  };
}

/**
 * Performs a server request to refresh the labels in the Redux store.
 */
export function fetchLabels() {
  return dispatch =>
    apiClient
      .get('/labels/')
      .catch(error => dispatch(displayError(error)))
      .then(({ data }) => dispatch(setLabels(data)));
}

/**
 * Updates the labels in the Redux store.
 * @param {object} labels - a dictionary of label names and information
 */
export function setLabels(labels) {
  let data = labels;
  if (Object.prototype.toString.call(labels) === '[object Array]') {
    // Convert array to object
    const labelsMap = {};
    labels.forEach((label) => {
      labelsMap[label.name] = label;
    });
    data = labelsMap;
  }
  return { type: ActionTypes.SET_LABELS, data };
}

/**
 * Sets the label filter for the calendar view.
 *
 * @param {array} visibleLabels - which labels should be used to filter the
 *     events (presence indicates visible, absence indicates invisible)
 * @param {string|undefined} allNoneDefault - 'all', 'none' or 'default' if that
 *      button was clicked in the sidebar (triggers reporting of the action to
 *      Google Analytics)
 */
export function setVisibleLabels(visibleLabels, allNoneDefault) {
  if (allNoneDefault !== undefined) {
    ReactGA.event({
      category: 'Filter Tags All|None|Default',
      action: allNoneDefault,
      label: 'User used All | None | Default option in sidebar filter pane',
    });
  }
  return { type: ActionTypes.SET_FILTER_LABELS, data: visibleLabels };
}

/**
 * Toggles whether or not events with a particular label should be shown on the
 * calendar. (An event with the given label will still be displayed if another
 * one of its labels is selected for the filter [an OR operator is used].)
 *
 * @param {string} labelName - the name of the label to toggle
 */
export function labelVisibilityToggled(labelName) {
  ReactGA.event({
    category: 'Tag Toggled in Sidebar',
    action: labelName,
    label: 'User toggled visibility of label on calendar',
  });
  return { type: ActionTypes.FILTER_LABEL_TOGGLED, labelName };
}

export function updateLabel(data) {
  return () => {
    // TODO: update model on success
    apiClient
      .post(`/labels/${data.id}`, data)
      .catch(error => alert(`Update label failed:\n${error}`));
  };
}

// ########## End Labels-Related Actions ########## //
