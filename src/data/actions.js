import { push } from 'react-router-redux';
import fetch from 'isomorphic-fetch';

export const ActionTypes = {
    REFRESH_EVENTS_IF_NEEDED: 'REFRESH_EVENTS_IF_NEEDED',
    FETCH_EVENTS: 'FETCH_EVENTS',
    REQUESTING_EVENTS: 'REQUESTING_EVENTS',
    SET_CURRENT_EVENT: 'SET_CURRENT_EVENT',
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

export function setCurrentEvent(eventId) {
    return {type: ActionTypes.SET_CURRENT_EVENT, id: eventId};
}

export function deleteCurrentEvent() {
    return (dispatch, getState) => {
        if (confirm('Are you sure you want to delete this event?')) {
            let idSuffix = getState().events.current;
            // TODO Delete the event
        }
    };
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

export function setVisibleLabels(visibleLabels) {
    return {type: ActionTypes.SET_VISIBLE_LABELS, data: visibleLabels};
}

export function labelVisibilityToggled(labelName) {
    return {type: ActionTypes.LABEL_VISIBILITY_TOGGLED, labelName};
}

export function setSidebarMode(mode) {
    return {type: ActionTypes.SET_SIDEBAR_MODE, mode};
}

export function refreshEvents(start, end) {
    return (dispatch) => {
        // Update the state to know that we're fetching events
        dispatch(refreshingEvents());

        const startString = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`;
        const endString = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()}`;
        return fetch(`${window.abe_url}/events/?start=${startString}&end=${endString}`)
            .then(
                response => response.json(),
                error => dispatch(displayError(error)))
            .then(events => dispatch(setLabels(events)));
    };
}

export function refreshingEvents() {
    return {type: ActionTypes.REQUESTING_EVENTS};
}

export function setMarkdownGuideVisibility(visible) {
    return {type: ActionTypes.SET_MARKDOWN_GUIDE_VISIBILITY, visible};
}

export function toggleSidebarCollapsed() {
    return {type: ActionTypes.TOGGLE_SIDEBAR_VISIBILITY};
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

export function setRoute(route) {
    return dispatch => {
        dispatch(push(route));
    }
}