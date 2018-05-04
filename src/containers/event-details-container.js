// This container is a sort of middleware between the React page and the Redux data store

import { connect } from 'react-redux';
import {
  setSidebarMode,
  setPageTitlePrefix,
  getEventDataViaUrlParams,
  clearCurrentEvent,
} from '../data/actions';
import EventDetailsPage from '../pages/details/event-details-page';

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => ({
  eventData: state.events.current,
});

// This function passes functions from /srcs/data/actions.jsx to the React component as props
const mapDispatchToProps = dispatch => ({
  setSidebarMode: (mode) => {
    dispatch(setSidebarMode(mode));
  },
  getEventDataViaUrlParams: (urlParams) => {
    dispatch(getEventDataViaUrlParams(urlParams));
  },
  setPageTitlePrefix: (title) => {
    dispatch(setPageTitlePrefix(title));
  },
  clearCurrentEvent: () => {
    dispatch(clearCurrentEvent());
  },
});

// Connect props to Redux state and actions
const ViewEventContainer = connect(mapStateToProps, mapDispatchToProps)(EventDetailsPage);

export default ViewEventContainer;
