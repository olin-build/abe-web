import { connect } from 'react-redux';
import { setSidebarMode, setCurrentEventId, setPageTitlePrefix } from '../data/actions';
import ViewEventScene from '../scenes/View/view-event-scene.jsx';

const mapStateToProps = state => {
    return {
        events: state.events.events,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        unsetCurrentEventId: () => {
            dispatch(setCurrentEventId(null));
        },
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        editEvent: (linkSuffix) => {
            dispatch(push('/edit/'+linkSuffix));
        },
        setCurrentEvent: (eventId) => {
            dispatch(setCurrentEvent(eventId));
        },
        setPageTitlePrefix: (title) => {
            dispatch(setPageTitlePrefix(title));
        }
    }
};

// Connect props to Redux state and actions
const ViewEventContainer = connect(mapStateToProps, mapDispatchToProps)(ViewEventScene);

export default ViewEventContainer;