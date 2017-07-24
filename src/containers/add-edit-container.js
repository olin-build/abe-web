import { connect } from 'react-redux';
import { setSidebarMode } from '../data/actions';
import AddEditEventScene from '../scenes/AddEdit/add-edit-scene.jsx';

const mapStateToProps = state => {
    return {
        // events: getVisibleEvents(state.events, state.labels),
        labels: state.labels
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        }
    }
};

// Connect props to Redux state and actions
const AddEditContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditEventScene);

export default AddEditContainer;