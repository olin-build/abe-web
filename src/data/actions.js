import { push } from 'react-router-redux';
import fetch from 'isomorphic-fetch';
import moment from "moment";
import ReactGA from 'react-ga';

export const ActionTypes = {
    REFRESH_EVENTS_IF_NEEDED: 'REFRESH_EVENTS_IF_NEEDED',
    FETCH_EVENTS: 'FETCH_EVENTS',
    REQUESTING_EVENTS: 'REQUESTING_EVENTS',
    SET_CURRENT_EVENT_ID: 'SET_CURRENT_EVENT_ID',
    SET_CURRENTLY_VIEWING_DATE: 'SET_CURRENTLY_VIEWING_DATE',
    SET_EVENTS: 'SET_EVENTS',
    SET_VIEW_MODE: 'SET_VIEW_MODE',
    DISPLAY_ERROR: 'DISPLAY_ERROR',
    DISPLAY_MESSAGE: 'DISPLAY_MESSAGE',
    ADD_EVENT: 'ADD_EVENT',
    REFRESH_LABELS_IF_NEEDED: 'REFRESH_LABELS_IF_NEEDED',
    FETCH_LABELS: 'FETCH_LABELS',
    REQUESTING_LABELS: 'REQUESTING_LABELS',
    SET_LABELS: 'SET_LABELS',
    SET_VISIBLE_LABELS: 'SET_VISIBLE_LABELS',
    LABEL_VISIBILITY_TOGGLED: 'LABEL_VISIBILITY_TOGGLED',
    SET_LABEL_VISIBILITY: 'SET_LABEL_VISIBILITY',
    SET_SIDEBAR_MODE: 'SET_SIDEBAR_MODE',
    SET_SIDEBAR_COMPONENT_VISIBILITY: 'SET_SIDEBAR_COMPONENT_VISIBILITY',
    GENERATE_ICS_FEED: 'GENERATE_ICS_FEED',
    START_REDIRECT: 'START_REDIRECT',
    SET_MARKDOWN_GUIDE_VISIBILITY: 'SET_MARKDOWN_GUIDE_VISIBILITY',
    TOGGLE_SIDEBAR_VISIBILITY: 'TOGGLE_SIDEBAR_VISIBILITY',
    SET_PAGE_TITLE: 'SET_PAGE_TITLE',
};

export function displayMessage(message) {
    return {type: ActionTypes.DISPLAY_MESSAGE, message};
}

export function displayError(error, message) {
    return {type: ActionTypes.DISPLAY_ERROR, error, message};
}

export function setCurrentEventId(event) {
    return {type: ActionTypes.SET_CURRENT_EVENT_ID, event};
}

export function deleteCurrentEvent() {
    return (dispatch, getState) => {
        if (confirm('Are you sure you want to delete this event?')) {
            let idSuffix = getState().events.current;
            // TODO Delete the event
        }
    };
}

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

export function eventDeleteFailed(eventId, error) {
    ReactGA.event({
        category: 'Event Delete',
        action: 'failure',
        label: `Event ${eventId} delete attempt unsuccessful`,
    });
    alert('Delete event failed:\n' + error);
}

export function refreshLabelsIfNeeded() {
    return (dispatch, getState) => {
        if (!getState().labels.labelList) {
            dispatch(refreshLabels());
        }
    };
}

export function refreshLabels() {
    return (dispatch) => {
        // Update the state to know that we're fetching labels
        dispatch(refreshingLabels());

        return fetch(window.abe_url + '/labels/')
            .then(
                response => response.json(),
                error => dispatch(displayError(error)))
            .then(labels => dispatch(setLabels(labels)));
    };
}

export function refreshingLabels() {
    return {type: ActionTypes.REQUESTING_LABELS};
}

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

export function setVisibleLabels(visibleLabels, allNoneDefault) {
    if (allNoneDefault !== undefined) {
        ReactGA.event({
            category: 'Filter Tags All|None|Default',
            action: allNoneDefault,
            label: 'User used All | None | Default option in sidebar filter pane',
        });
    }
    return {type: ActionTypes.SET_VISIBLE_LABELS, data: visibleLabels};
}

export function setCurrentlyViewingDate(date) { // Set the first date visible on the calendar
    date.hour(0).minute(0).second(0); // Set to the start of the day to avoid any potential weirdness when manipulating later
    // TODO Cache request responses (so don't need to make request on every page change)
    return (dispatch) => {
        // Find the first day of the first week of the month
        const firstDay = moment(date).date(0).day(0);
        // Find the last day of the last week of the month
        const lastDay = moment(date).date(0).add(1, 'M').subtract(1, 'd').day(6);
        dispatch(refreshEvents(firstDay, lastDay));
        dispatch({ type: ActionTypes.SET_CURRENTLY_VIEWING_DATE, data: date });
    };
}

export function setViewMode(mode) { // Calendar, week, day, etc
    return {type: ActionTypes.SET_VIEW_MODE, data: mode};
}

export function page(direction) {
    return (dispatch, getState) => {
        const state = getState();
        const delta = getPageDelta(state);
        const newDate = moment(state.general.currentlyViewingDate).add(direction * delta[0], delta[1]);
        dispatch(setCurrentlyViewingDate(newDate));
    }
}

export function setEvents(events) {
    return (dispatch) => {
        const res = {};
        events.forEach((event) => {
            const key = event.id || event.sid;
            res[key] = event;
        });
        dispatch({type: ActionTypes.SET_EVENTS, data: res });
    }
}

export function labelVisibilityToggled(labelName) {
    ReactGA.event({
        category: 'Tag Toggled in Sidebar',
        action: labelName,
        label: 'User toggled visibility of label on calendar',
    });
    return {type: ActionTypes.LABEL_VISIBILITY_TOGGLED, labelName};
}

export function setSidebarMode(mode) {
    return {type: ActionTypes.SET_SIDEBAR_MODE, mode};
}

export function refreshEvents(start, end) {
    return (dispatch) => {
        // Update the state to know that we're fetching events
        dispatch(refreshingEvents());

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

export function refreshingEvents() {
    return {type: ActionTypes.REQUESTING_EVENTS};
}

export function setMarkdownGuideVisibility(visible) {
    return {type: ActionTypes.SET_MARKDOWN_GUIDE_VISIBILITY, visible};
}

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
        dispatch({ type: ActionTypes.SET_PAGE_TITLE, title: fullTitle });
    }
}

export function editEvent(id, sid, recId, editSingleOccurrence) {
    return dispatch => {
        const linkSuffix = editSingleOccurrence ?
            `${sid}/${recId}`
            : (sid ? sid : id);
        const path = `/edit/${linkSuffix}`;
        dispatch(push(path));
    }
}

export function viewEvent(id, sid, recId) {
    return dispatch => {
        const linkSuffix = id ? id : `${sid}/${recId}`;
        const path = `/view/${linkSuffix}`;
        dispatch(push(path));
    }
}

export function setRoute(route) {
    return dispatch => {
        dispatch(push(route));
    }
}


function getPageDelta(state) {
    switch (state.general.viewMode) {
        case 'month':
            return [1, 'M'];
        case '3-day':
            return [3, 'd'];
        case '2-day':
            return [2, 'd'];
        case 'week':
            return [1, 'w'];
        default: // Daily
            return [1, 'd'];
    }
}