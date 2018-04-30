// This container is a sort of middleware between the React import component and the Redux data store

import { connect } from 'react-redux';
import {
  setSidebarMode,
  toggleSidebarCollapsed,
  setPageTitlePrefix,
} from '../data/actions';
import ImportPage from '../pages/import/import';
import * as ga from 'react-ga';

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
  importSuccess: (response, importData) => {
    ga.event({
      category: 'ICS Feed Import',
      variable: 'success',
      value: importData,
      label: 'User successfully imported ICS feed into ABE',
    });
    alert('ICS imported successfully');
  },
  importFailed: (error, importData) => {
    ga.event({
      category: 'ICS Feed Import',
      variable: 'failure',
      value: JSON.stringify({ error, importData }),
      label: 'ICS feed import into ABE failed',
    });
    alert(`ICS import failed:\n${error}`);
  },
});

// Connect props to Redux state and actions
const ImportContainer = connect(mapStateToProps, mapDispatchToProps)(ImportPage);

export default ImportContainer;
