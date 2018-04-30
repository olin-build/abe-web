// This container is a sort of middleware between the React page and the Redux data store

import { connect } from 'react-redux';
import {
  setSidebarMode,
  toggleSidebarCollapsed,
  setPageTitlePrefix,
  getEventDataViaUrlParams,
  deleteCurrentEvent,
  eventSavedSuccessfully,
  eventSaveFailed,
} from '../data/actions';
import AddEditEventPage from '../pages/add-edit/add-edit-page';

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => {
  return {
    general: state.general,
    eventData: state.events.current,
    possibleLabels: state.labels.labelList,
  }
};

// This function passes functions from /src/data/actions.js to the React component as props
const mapDispatchToProps = dispatch => {
  return {
    setSidebarMode: mode => {
      dispatch(setSidebarMode(mode));
    },
    setPageTitlePrefix: (title) => {
      dispatch(setPageTitlePrefix(title));
    },
    toggleSidebarCollapsed: () => {
      dispatch(toggleSidebarCollapsed());
    },
    getEventDataViaUrlParams: (urlParams) => {
      dispatch(getEventDataViaUrlParams(urlParams));
    },
    deleteCurrentEvent: () => {
      if (confirm('Are you sure you want to delete this event?')) {
        dispatch(deleteCurrentEvent());
      }
    },
    cancelButtonClicked: () => {
      window.history.back(); // TODO: Make sure this is done right
    },
    eventSavedSuccessfully: (event) => {
      dispatch(eventSavedSuccessfully(event));
    },
    eventSaveFailed: (event, error) => {
      dispatch(eventSaveFailed(event, error));
    },
  }
};

// Connect props to Redux state and actions
const AddEditContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditEventPage);

export default AddEditContainer;
