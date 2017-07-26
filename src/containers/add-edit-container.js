import { connect } from 'react-redux';
import { setSidebarMode, setMarkdownGuideVisibility } from '../data/actions';
import AddEditEventScene from '../scenes/AddEdit/add-edit-scene.jsx';

const mapStateToProps = state => {
    return {
        // events: getVisibleEvents(state.events, state.labels),
        labels: state.labels,
        markdownGuideVisible: state.addEdit.markdownGuideVisible
    }
};

const mapDispatchToProps = dispatch => {
    return {
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