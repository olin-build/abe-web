import { connect } from 'react-redux';
import { setSidebarMode, setMarkdownGuideVisibility, refreshLabelsIfNeeded } from '../data/actions';
import AddEditEventScene from '../scenes/AddEdit/add-edit-scene.jsx';

const mapStateToProps = state => {
    return {
        general: state.general,
        // events: getVisibleEvents(state.events, state.labels),
        possibleLabels: state.labels.labelList,
        markdownGuideVisible: state.addEdit.markdownGuideVisible
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(refreshLabelsIfNeeded());
        },
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        setMarkdownGuideVisibility: visible => {
            dispatch(setMarkdownGuideVisibility(visible));
        },
    }
};

// Connect props to Redux state and actions
const AddEditContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditEventScene);

export default AddEditContainer;