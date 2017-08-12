import { connect } from 'react-redux';
import { setSidebarMode, setCurrentEvent } from '../data/actions';
import ViewEventScene from '../scenes/View/view-event-scene.jsx';

const mapStateToProps = state => {
    return {
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        editEvent: (linkSuffix) => {
            dispatch(push('/edit/'+linkSuffix));
        },
        setCurrentEvent: (eventId) => {
            dispatch(setCurrentEvent(eventId));
        },
    }
};

// Connect props to Redux state and actions
const ViewEventContainer = connect(mapStateToProps, mapDispatchToProps)(ViewEventScene);

export default ViewEventContainer;