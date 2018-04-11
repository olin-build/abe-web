// This file contains a bunch of Redux actions

import { push } from 'react-router-redux';
import fetch from 'isomorphic-fetch';
import moment from "moment";
import ReactGA from 'react-ga';

export const ActionTypes = {
    // General UI
    DISPLAY_ERROR: 'DISPLAY_ERROR', // Displays an error message (red background) at the top of the screen TODO: Issue #54
    DISPLAY_MESSAGE: 'DISPLAY_MESSAGE', // Displays a message at the top of the screen TODO: Issue #54
    SET_PAGE_TITLE_PREFIX: 'SET_PAGE_TITLE_PREFIX', // Sets the prefix of the page title (before the app name)
    SET_SIDEBAR_PANE_VISIBILITY: 'SET_SIDEBAR_PANE_VISIBILITY', // Sets which panes (components) are visible in the sidebar
    SET_SIDEBAR_MODE: 'SET_SIDEBAR_MODE', // Sets which panes (components) are visible in the sidebar based on a layout template
    TOGGLE_SIDEBAR_VISIBILITY: 'TOGGLE_SIDEBAR_VISIBILITY', // Toggles the visibility of the app sidebar
    // Calendar view
    SET_FOCUSED_DATE: 'SET_FOCUSED_DATE', // Sets the day the calendar view is ensuring is shown (changing this changes which time period is shown on the calendar)
    SET_FILTER_LABELS: 'SET_FILTER_LABELS', // Sets which labels are selected as part of the event filter
    FILTER_LABEL_TOGGLED: 'FILTER_LABEL_TOGGLED', // Toggles whether or not a specific label is selected as part of the event filter
    SET_FILTER_LABEL_SELECTED: 'SET_FILTER_LABEL_SELECTED', // Sets whether or not a specific label is selected as part of the event filter
    SET_VIEW_MODE: 'SET_VIEW_MODE', // Sets which view mode (month, week, day, etc) the calendar is in
    // Event data
    SET_CURRENT_EVENT: 'SET_CURRENT_EVENT', // Keeps track of the data for the event currently being viewed or edited
    FETCH_EVENTS_IF_NEEDED: 'FETCH_EVENTS_IF_NEEDED', // Triggers FETCH_EVENTS if no event data is loaded
    FETCH_EVENTS: 'FETCH_EVENTS', // Fetches event data from the server
    SET_EVENTS: 'SET_EVENTS', // Sets the event data using data from a server response
    // Labels
    FETCH_LABELS: 'FETCH_LABELS', // Fetches all labels and their data from the server
    FETCH_LABELS_IF_NEEDED: 'FETCH_LABELS_IF_NEEDED', // Calls FETCH_LABELS if no label data is loaded
    SET_LABELS: 'SET_LABELS', // Sets the label data using data from a server response
    // ICS
    GENERATE_ICS_FEED: 'GENERATE_ICS_FEED', // Triggers generation of an ICS feed with current filter applied and copies URL to clipboard
};

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
    return {type: ActionTypes.DISPLAY_MESSAGE, message};
}

/**
 * Display an error message (red background) at the top of the window in a notification bar TODO: Issue #54
 */
export function displayError(error, message) {
    return {type: ActionTypes.DISPLAY_ERROR, error, message};
}

// ----- End notification/message bar actions ----- //

// ----- Begin sidebar actions ----- //

/**
 * Sets the display mode (i.e. which panes are visible).
 * @param {object} mode - one of the modes defined in /src/data/sidebar-modes.js
 */
export function setSidebarMode(mode) {
    return {type: ActionTypes.SET_SIDEBAR_MODE, mode};
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
    }
}

// ----- End sidebar actions ----- //

// ----- Begin miscellaneous UI actions ----- //

/**
 * Sets the page title prefix (what's displayed before the cross-site app name suffix)
 * @param {string} newTitle - the title
 */
export function setPageTitlePrefix(newTitle) {
    return (dispatch, getState) => {
        let fullTitle;
        const pageTitleSuffix = getState().general.pageTitleSuffix;
        if (!newTitle || newTitle.length === 0) {
            fullTitle = pageTitleSuffix;
        } else if (newTitle.length > 50) {
            fullTitle = `${newTitle.substring(0, 50)}... | ${pageTitleSuffix}`;
        } else {
            fullTitle = `${newTitle} | ${pageTitleSuffix}`;
        }
        dispatch({ type: ActionTypes.SET_PAGE_TITLE_PREFIX, title: fullTitle });
    }
}

// ----- End miscellaneous UI actions ----- //

// ########## End General UI Actions ########## //


// ########## Begin Navigation Actions ########## //

/**
 * Sets the page route (URL suffix).
 * @param {string} route - the URL suffix to use ('/calendar/', '/view/<event_id>', etc)
 */
export function setRoute(route) {
    return dispatch => {
        dispatch(push(route));
    }
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
    }
}

/**
 * Calculates how many of what unit (3 days, 1 week, etc) the currently viewing date should be changed by, based on
 * what display mode (month, week, day, etc) the calendar is in
 */
function getPageDelta(state) {
    return state.calendar.currentViewMode.daysVisible > 0
      ? [state.calendar.currentViewMode.daysVisible, 'd']
      : [1, 'M'];
}

/**
 * Sets the date the calendar should be "centered" around
 * @param {Moment} date - the first day to show in a multi-day view, or to be used to determine the week or month to
 * show in a week or month view, etc.
 */
export function setCurrentlyViewingDate(date) { // Set the first date visible on the calendar
    date.hour(0).minute(0).second(0); // Set to the start of the day to avoid any potential weirdness when manipulating later
    // TODO Cache request responses (so don't need to make request on every page change)
    return (dispatch) => {
        // Find the first day of the first week of the month
        const firstDay = moment(date).date(0).day(0);
        // Find the last day of the last week of the month
        const lastDay = moment(date).date(0).add(1, 'M').subtract(1, 'd').day(6);
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
      if (mode === state.calendar.possibleViewModes['Week']) {
          const firstOfWeek = moment(state.calendar.currentlyViewingDate).day(7);
          dispatch({ type: ActionTypes.SET_FOCUSED_DATE, data: firstOfWeek });
      }
      dispatch({type: ActionTypes.SET_VIEW_MODE, data: mode});
    };
}

// ----- End calendar view mode ----- //

// ########## End Calendar View Actions ########## //



// ########## Begin Event Data Actions ########## //

// ----- Begin general event actions ----- //

/**
 * Sets the current event so that the entire app can know what's being viewed or edited (esp. the sidebar)
 * @param event: an event object
 */
export function setCurrentEvent(event) {
    return {type: ActionTypes.SET_CURRENT_EVENT, event};
}


/**
 * Fetches events for the given period.
 * @param {Moment} start - the first day to fetch events for
 * @param {Moment} end - the last day to fetch events for
 */
export function refreshEvents(start, end) {
    return (dispatch) => {

        const startString = `${start.year()}-${start.month()+1}-${start.date()}`;
        const endString = `${end.year()}-${end.month()+1}-${end.date()}`;
        return fetch(`${window.abe_url}/events/?start=${startString}&end=${endString}`)
            .then(
                response => response.json(),
                error => dispatch(displayError(error)))
            .then((events) => {
                events.forEach((event) => {
                    event.start = moment(event.start).utcOffset(-8);
                    event.end = moment(event.end).utcOffset(-8);
                });
                dispatch(setEvents(events))
            });
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
            const eventKey = event.id || (event.sid + event.start.format('YYYYDDD'));
            res[eventKey] = event;
        });
        dispatch({type: ActionTypes.SET_EVENTS, data: res });
    }
}

// ----- End general event actions ----- //


// ----- Begin editing event actions ----- //

/**
 * Triggers switching to the event edit page.
 * @param {number} id - the ID of the event (if not recurring, undefined otherwise)
 * @param {number} sid - the ID of the recurring event (if event recurring, undefined otherwise)
 * @param {number} recId - the recurrence ID of this occurrence of an event (if event recurring, undefined otherwise)
 * @param {bool} editSingleOccurrence - whether or not only a single occurrence of the recurring series should be edited
 */
export function editEvent(id, sid, recId, editSingleOccurrence) {
    return dispatch => {
        const linkSuffix = editSingleOccurrence ?
            `${sid}/${recId}`
            : (sid ? sid : id);
        const path = `/edit/${linkSuffix}`;
        dispatch(push(path));
    }
}

/**
 * Called when the server returns a success status code in response to a save request.
 * @param {object} eventIdInfo - info about the ID of the saved event
 */
export function eventSavedSuccessfully(eventIdInfo) {
    return (dispatch) => {
        let label;
        let action = 'update success';
        if (eventIdInfo.id) {
            label = `Event ${eventIdInfo.id} saved successfully`;
        } else if (eventIdInfo.sid) {
            label = `Event ${eventIdInfo.sid}/${eventIdInfo.recId} saved successfully`;
        } else {
            label = 'Event created successfully';
            action = 'create success';
        }
        ReactGA.event({
            category: 'Event Save',
            action,
            label,
        });
        dispatch(push('/'));
    }
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
    alert('Saving event failed:\n' + error);
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
        dispatch(push('/'));
    }
}

/**
 * Called when an attempted event deletion failed.
 * @param {object} eventId - the ID of the event that we attempted to delete
 * @param {object} error - information about the error that occurred
 */
export function eventDeleteFailed(eventId, error) {
    ReactGA.event({
        category: 'Event Delete',
        action: 'failure',
        label: `Event ${eventId} delete attempt unsuccessful`,
    });
    alert('Delete event failed:\n' + error);
}

// ----- Begin event viewing actions ----- //

/**
 * Triggers showing the event details page.
 * @param {object} event - the event data of the event to view
 */
export function viewEvent(event) {
    return dispatch => {
        const linkSuffix = event.id || `${event.sid}/${event.recId}`;
        const path = `/view/${linkSuffix}`;
        dispatch(push(path));
    }
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
            dispatch(refreshLabels());
        }
    };
}

/**
 * Performs a server request to refresh the labels in the Redux store.
 */
export function refreshLabels() {
    return (dispatch) => fetch(window.abe_url + '/labels/')
        .then(
            response => response.json(),
            error => dispatch(displayError(error)))
        .then(labels => dispatch(setLabels(labels)));
}

/**
 * Updates the labels in the Redux store.
 * @param {object} labels - a dictionary of label names and information
 */
export function setLabels(labels) {
    if (Object.prototype.toString.call( labels ) === '[object Array]') {
        // Convert array to object
        let labelsMap = {};
        labels.forEach(label => {
            labelsMap[label.name] = label;
        });
        labels = labelsMap;
    }
    return {type: ActionTypes.SET_LABELS, data: labels};
}

/**
 * Sets the label filter for the calendar view.
 * @param {array} visibleLabels - which labels should be used to filter the events (presence indicates visible, absence
 * indicates invisible)
 * @param {string|undefined} allNoneDefault - 'all', 'none' or 'default' if that button was clicked in the sidebar
 *      (triggers reporting of the action to Google Analytics)
 */
export function setVisibleLabels(visibleLabels, allNoneDefault) {
    if (allNoneDefault !== undefined) {
        ReactGA.event({
            category: 'Filter Tags All|None|Default',
            action: allNoneDefault,
            label: 'User used All | None | Default option in sidebar filter pane',
        });
    }
    return {type: ActionTypes.SET_FILTER_LABELS, data: visibleLabels};
}

/**
 * Toggles whether or not events with a particular label should be shown on the calendar. (An event with the given label
 * will still be displayed if another one of its labels is selected for the filter [an OR operator is used].)
 * @param {string} labelName - the name of the label to toggle
 */
export function labelVisibilityToggled(labelName) {
    ReactGA.event({
        category: 'Tag Toggled in Sidebar',
        action: labelName,
        label: 'User toggled visibility of label on calendar',
    });
    return {type: ActionTypes.FILTER_LABEL_TOGGLED, labelName};
}

// ########## End Labels-Related Actions ########## //