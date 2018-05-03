import { connect } from 'react-redux';
import LabelsPage from '../pages/labels/labels';
import { refreshLabelsIfNeeded, updateLabel } from '../data/actions';

// Pass data from the Redux state to the React component
const mapStateToProps = state => ({
    labels: state.labels.labelList,
});

// Pass functions from src/data/actions.jsx to the React component
const mapDispatchToProps = dispatch => ({
    updateLabel: (data) => {
        dispatch(updateLabel(data));
    },
    refreshLabelsIfNeeded,
});

// Connect props to Redux state and actions
const LabelsContainer = connect(mapStateToProps, mapDispatchToProps)(LabelsPage);

export default LabelsContainer;
