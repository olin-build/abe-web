import { ActionTypes } from './actions';
import SidebarModes from '../data/sidebar-modes';
import copy from 'copy-to-clipboard';

export function general(state = {}, action) {
    switch (action.type) {
        case ActionTypes.COPY_TO_CLIPBOARD:
            copy(action.content);
            return state;
        case ActionTypes.DISPLAY_MESSAGE:
            alert(action.message);
            return state;
        case ActionTypes.DISPLAY_ERROR:
            alert((action.message) ? action.message : action.error);
            console.error(action.error);
            return state;
        default:
            return state;
    }
}

export function events(state = [], action) {
    switch (action.type) {
        case ActionTypes.ADD_EVENT:
            return [...state, action.data]; // TODO Make this better
        case ActionTypes.GENERATE_ICS_FEED:
            console.debug('Generate ICS Feed button clicked...');
            return state;
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
        case ActionTypes.SET_SIDEBAR_MODE:
            return action.mode;
        default:
            return state
    }
}

export function labels(state = {}, action) {
    switch (action.type) {
        case ActionTypes.SET_LABELS:
            return action.data;
        case ActionTypes.LABEL_VISIBILITY_TOGGLED:
            let newState = Object.assign({}, state);
            newState[action.labelName].default = !newState[action.labelName].default;
            return newState;
        case ActionTypes.SET_LABEL_VISIBILITY:
            // TODO Test this
            return Object.assign({}, state, {
                [action.labelName]: Object.assign({}, state[action.labelName], {
                    default: action.visible
                })
            });
        default:
            return state
    }
}
