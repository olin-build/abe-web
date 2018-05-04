import { connect } from 'react-redux';
import LabelsPage from '../pages/labels/labels';
import { refreshLabelsIfNeeded, setPageTitlePrefix, setSidebarMode, updateLabel } from '../data/actions';
import SidebarModes from '../data/sidebar-modes';

// Pass data from the Redux state to the React component
const mapStateToProps = state => ({
  labels: state.labels.labelList,
});

// Pass functions from src/data/actions.jsx to the React component
const mapDispatchToProps = dispatch => ({
  refreshLabelsIfNeeded,
  updateLabel: (data) => {
    dispatch(updateLabel(data));
  },
  setPageTitlePrefix: (title) => {
    dispatch(setPageTitlePrefix(title));
  },
  setSidebarMode: () => {
    dispatch(setSidebarMode(SidebarModes.EMPTY));
  },
});

// Connect props to Redux state and actions
const LabelsContainer = connect(mapStateToProps, mapDispatchToProps)(LabelsPage);

export default LabelsContainer;
