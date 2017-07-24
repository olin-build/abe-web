import fetch from 'isomorphic-fetch';

export const ActionTypes = {
    FETCH_EVENTS: 'FETCH_EVENTS',
    DISPLAY_ERROR: 'DISPLAY_ERROR',
    ADD_EVENT: 'ADD_EVENT',
    FETCH_LABELS: 'FETCH_LABELS',
    REQUESTING_LABELS: 'REQUESTING_LABELS',
    SET_LABELS: 'SET_LABELS',
    LABEL_VISIBILITY_TOGGLED: 'LABEL_VISIBILITY_TOGGLED',
    SET_SIDEBAR_MODE: 'SET_SIDEBAR_MODE',
    SET_SIDEBAR_COMPONENT_VISIBILITY: 'SET_SIDEBAR_COMPONENT_VISIBILITY',
    GENERATE_ICS_FEED: 'GENERATE_ICS_FEED',
    START_REDIRECT: 'START_REDIRECT',
};

export function displayError(error) {
    return {type: ActionTypes.DISPLAY_ERROR, error};
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
    let labelsMap = {};
    labels.forEach(label => {
        labelsMap[label.name] = label;
    });
    return {type: ActionTypes.SET_LABELS, data: labelsMap};
}

export function labelVisibilityToggled(labelName) {
    return {type: ActionTypes.LABEL_VISIBILITY_TOGGLED, labelName};
}

export function setSidebarMode(mode) {
    return {type: ActionTypes.SET_SIDEBAR_MODE, mode};
}

// export function addEvent(event) {
//     // TODO Make sure this is done correctly
//     browserHistory.push('/edit');
//     //return {type: ActionTypes.ADD_EVENT, data: event};
// }

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

export function generateICSFeed() {
    return {type: ActionTypes.GENERATE_ICS_FEED}
}

export function startRedirect(url) {
    return {type: ActionTypes.START_REDIRECT, url};
}