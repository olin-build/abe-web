import { push } from 'react-router-redux';
import fetch from 'isomorphic-fetch';

export const ActionTypes = {
    REFRESH_EVENTS_IF_NEEDED: 'REFRESH_EVENTS_IF_NEEDED',
    FETCH_EVENTS: 'FETCH_EVENTS',
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
};

export function displayMessage(message) {
    return {type: ActionTypes.DISPLAY_MESSAGE, message};
}

export function displayError(error, message) {
    return {type: ActionTypes.DISPLAY_ERROR, error, message};
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
        // Update the state to know that we're fetching labels
        dispatch(refreshingLabels());
        return fetch(window.abe_url + '/events/')
            .then(
                response => response.json(),
                error => dispatch(displayError(error)))
            .then(events => dispatch(setLabels(events)));
    };
}

export function refreshingEvents() {
    return {type: ActionTypes.REQUESTING_LABELS};
}

export function setMarkdownGuideVisibility(visible) {
    return {type: ActionTypes.SET_MARKDOWN_GUIDE_VISIBILITY, visible};
}

export function toggleSidebarCollapsed() {
    return {type: ActionTypes.TOGGLE_SIDEBAR_VISIBILITY};
}

export function setRoute(route) {
    return dispatch => {
        dispatch(push(route));
    }
}