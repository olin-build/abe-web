import { ActionTypes } from './actions';
import SidebarModes from '../data/sidebar-modes';

export function general(state = {}, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case ActionTypes.SET_VIEW_MODE:
            newState.viewMode = action.data;
            return newState;
        case ActionTypes.SET_CURRENTLY_VIEWING_DATE:
            newState.currentlyViewingDate = action.data;
            return newState;
        case ActionTypes.DISPLAY_MESSAGE:
            alert(action.message);
            return state;
        case ActionTypes.DISPLAY_ERROR:
            alert((action.message) ? action.message : action.error);
            console.error(action.error);
            return state;
        case ActionTypes.SET_PAGE_TITLE:
            window.document.title = action.title;
            newState.general = Object.assign({}, newState.general, { pageTitlePrefix: action.title });
            return newState;
        default:
            return state;
    }
}

export function events(state = {}, action) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_EVENT_ID:
            return Object.assign({}, state, {
                current: action.event,
            });
        case ActionTypes.SET_EVENTS:
            return Object.assign({}, state, {
                events: action.data,
            });
        default:
            return state;
    }
}

export function addEdit(state = {}, action) {
    switch (action.type) {
        case ActionTypes.SET_MARKDOWN_GUIDE_VISIBILITY:
            return Object.assign({}, state, {
                markdownGuideVisible: action.visible
            });
        default:
            return state;
    }
}

export function sidebar(state = SidebarModes.LOADING, action) {
    switch (action.type) {
        case ActionTypes.TOGGLE_SIDEBAR_VISIBILITY:
            return Object.assign({}, state, {
               isCollapsed: !state.isCollapsed
            });
        case ActionTypes.SET_SIDEBAR_MODE:
            return Object.assign({}, state, { mode: action.mode });
        default:
            return state
    }
}

export function labels(state = {}, action) {
    let newState;
    switch (action.type) {
        case ActionTypes.REFRESH_LABELS_IF_NEEDED:
            if (Object.keys(state.labels.labelList).length === 0) {

            }
            return state;

        case ActionTypes.SET_LABELS:
            newState = Object.assign({}, state);
            let labelList = action.data;
            newState.labelList = labelList;

            // If the visible labels array hasn't been set yet, set it to be the default
            if (!state.visibleLabels) {
                let labelsArray = Object.values(labelList);
                newState.visibleLabels = (labelsArray.length > 0)
                                    ? labelsArray.filter(l => l.default).map(l => l.name)
                                    : [];
            }
            return newState;

        case ActionTypes.SET_VISIBLE_LABELS:
            return Object.assign({}, state, {
                visibleLabels: action.data
            });

        case ActionTypes.LABEL_VISIBILITY_TOGGLED:
            let visibleLabels = state.visibleLabels.slice();
            if (visibleLabels.includes(action.labelName)) {
                visibleLabels.splice(visibleLabels.indexOf(action.labelName),1);
            } else {
                visibleLabels.push(action.labelName);
            }
            return Object.assign({}, state, {visibleLabels});

        default:
            return state;
    }
}
