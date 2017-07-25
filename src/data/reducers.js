import { combineReducers } from 'redux';
import { ActionTypes } from './actions';
import SidebarModes from '../data/sidebar-modes';

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
            return action.mode;
        default:
            return state
    }
}
