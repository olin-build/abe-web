// Redux reducers
import SidebarModes from '../data/sidebar-modes';
import { ActionTypes } from './actions';

export function general(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_PAGE_TITLE_PREFIX:
      window.document.title = action.title;
      return {
        ...state,
        general: { ...state.general, pageTitlePrefix: action.title },
      };
    default:
      return state;
  }
}

export function user(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_ACCESS_INFO:
      return action.data;
    default:
      return state;
  }
}

export function calendar(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_FOCUSED_DATE:
      return { ...state, currentlyViewingDate: action.data };
    case ActionTypes.SET_VIEW_MODE:
      return { ...state, currentViewMode: action.data };
    default:
      return state;
  }
}

export function messages(state = [], action) {
  switch (action.type) {
    case ActionTypes.CLEAR_MESSAGES:
      return [];
    case ActionTypes.DISPLAY_MESSAGE:
      alert(action.message);
      return [{ id: +new Date(), type: 'message', message: action.message }, ...state];
    case ActionTypes.DISPLAY_ERROR:
      alert(action.message || action.error);
      return [
        { id: +new Date(), type: 'error', message: String(action.message || action.error) },
        ...state,
      ];
    default:
      return state;
  }
}

export function events(state = {}, action) {
  switch (action.type) {
    case ActionTypes.CLEAR_CURRENT_EVENT:
      return { ...state, current: null };
    case ActionTypes.SET_CURRENT_EVENT:
      return { ...state, current: action.data };
    case ActionTypes.SET_EVENTS:
      // Sort the list of labels on each event so that events with the same
      // labels always display with the same color
      Object.values(action.data).forEach(event => event.labels.sort());
      return { ...state, events: action.data };
    default:
      return state;
  }
}

export function sidebar(state = SidebarModes.LOADING, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_SIDEBAR_VISIBILITY:
      return { ...state, isCollapsed: !state.isCollapsed };
    case ActionTypes.SET_SIDEBAR_MODE:
      return { ...state, mode: action.mode };
    default:
      return state;
  }
}

export function labels(state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_LABELS_IF_NEEDED:
      return state;

    case ActionTypes.SET_LABELS: {
      const labelList = action.data;
      const defaultLabelNames = () =>
        Object.values(labelList)
          .filter(l => l.default)
          .map(l => l.name);

      return {
        ...state,
        labelList,
        // If the visible labels array hasn't been set yet, set it to be the default
        visibleLabels: state.visibleLabels || defaultLabelNames(),
      };
    }

    case ActionTypes.SET_FILTER_LABELS:
      return {
        ...state,
        visibleLabels: action.data,
      };

    case ActionTypes.FILTER_LABEL_TOGGLED: {
      const visibleLabels = state.visibleLabels.slice();
      if (visibleLabels.includes(action.labelName)) {
        visibleLabels.splice(visibleLabels.indexOf(action.labelName), 1);
      } else {
        visibleLabels.push(action.labelName);
      }
      return { ...state, visibleLabels };
    }

    default:
      return state;
  }
}
