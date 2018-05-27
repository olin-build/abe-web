// This container is a sort of middleware between the React import component and
// the Redux data store

import { connect } from 'react-redux';
import * as ga from 'react-ga';
import { setSidebarMode, toggleSidebarCollapsed, setPageTitlePrefix } from '../data/actions';
import SubscriptionEditorPage from '../pages/subscription/subscription';

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => ({
  general: state.general,
  labels: state.labels.labelList,
});

// This function passes functions from /srcs/data/actions.jsx to the React component as props
const mapDispatchToProps = (dispatch, getState) => ({
  setSidebarMode: (mode) => {
    dispatch(setSidebarMode(mode));
  },
  toggleSidebarCollapsed: () => {
    dispatch(toggleSidebarCollapsed());
    const action = getState().sidebar.isCollapsed ? 'expanding' : 'collapsing';
    ga.event({
      category: 'Sidebar',
      variable: 'collapseToggle',
      value: action,
      label: 'User toggled the visibility of the sidebar',
    });
  },
  setPageTitlePrefix: (title) => {
    dispatch(setPageTitlePrefix(title));
  },
  importSuccess: (importData) => {
    ga.event({
      category: 'Subscription Preferences',
      variable: 'success',
      value: importData,
      label: 'User successfully edited their subscription',
    });
    alert('Subscription preferences edited');
  },
  importFailed: (error, importData) => {
    ga.event({
      category: 'Subscription Preferences',
      variable: 'failure',
      value: JSON.stringify({ error, importData }),
      label: 'Editing subscription preferences failed',
    });
    alert(`Subscription editing failed:\n${error}`);
  },
});

// Connect props to Redux state and actions
const SubscriptionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscriptionEditorPage);

export default SubscriptionContainer;
