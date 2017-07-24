import { connect } from 'react-redux';
import { setSidebarMode } from '../data/actions';
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
        }
    }
};

// Connect props to Redux state and actions
const ViewEventContainer = connect(mapStateToProps, mapDispatchToProps)(ViewEventScene);

export default ViewEventContainer;