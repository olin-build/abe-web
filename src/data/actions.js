import fetch from 'isomorphic-fetch';

export const ActionTypes = {
    COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
    REFRESH_EVENTS_IF_NEEDED: 'REFRESH_EVENTS_IF_NEEDED',
    FETCH_EVENTS: 'FETCH_EVENTS',
    DISPLAY_ERROR: 'DISPLAY_ERROR',
    DISPLAY_MESSAGE: 'DISPLAY_MESSAGE',
    ADD_EVENT: 'ADD_EVENT',
    REFRESH_LABELS_IF_NEEDED: 'REFRESH_LABELS_IF_NEEDED',
    FETCH_LABELS: 'FETCH_LABELS',
    REQUESTING_LABELS: 'REQUESTING_LABELS',
    SET_LABELS: 'SET_LABELS',
    LABEL_VISIBILITY_TOGGLED: 'LABEL_VISIBILITY_TOGGLED',
    SET_LABEL_VISIBILITY: 'SET_LABEL_VISIBILITY',
    SET_SIDEBAR_MODE: 'SET_SIDEBAR_MODE',
    SET_SIDEBAR_COMPONENT_VISIBILITY: 'SET_SIDEBAR_COMPONENT_VISIBILITY',
    GENERATE_ICS_FEED: 'GENERATE_ICS_FEED',
    START_REDIRECT: 'START_REDIRECT',
    SET_MARKDOWN_GUIDE_VISIBILITY: 'SET_MARKDOWN_GUIDE_VISIBILITY',
};

export function displayMessage(message) {
    return {type: ActionTypes.DISPLAY_MESSAGE, message};
}

export function displayError(error, message) {
    return {type: ActionTypes.DISPLAY_ERROR, error, message};
}

export function copyToClipboard(content) {
    return {type: ActionTypes.COPY_TO_CLIPBOARD, content};
}

export function refreshLabelsIfNeeded() {
    return (dispatch, getState) => {
        let labels = getState().labels;
        if (Object.keys(labels).length === 0) {
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

export function generateICSFeed() {
    return (dispatch, getState) => {
        // Get the currently selected labels
        let labels = Object.values(getState().labels);
        let params = labels.filter(label => label.default);
        params = params.map(label => label.name);
        let url = window.abe_url + '/ics/?labels=' + params.join(',');
        // Check with the server to make sure we've generated a valid feed URL
        return fetch(url)
            .then(() => {
                // Copy the URL to the user's clipboard
                dispatch(copyToClipboard(url));
                dispatch(displayMessage('Your custom feed URL has automatically been copied to your clipboard. Paste it in your calendar application.\n\nYou will automatically receive new events matching your filter.'));
            }).catch((error) => {
                dispatch(displayError(error, 'Sorry, there was an error generating an ICS feed.'));
            });
    }
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