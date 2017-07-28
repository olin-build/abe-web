import { connect } from 'react-redux';
import Sidebar from '../sidebar/sidebar.jsx';
import SidebarModes from '../data/sidebar-modes';
import * as Actions from '../data/actions';
import { push } from 'react-router-redux';

const getVisibleEvents = (events, labels) => {
    return 'Hey, some events might go here...';
    switch (filter) {
        case 'SHOW_ALL':
            return events;
        case 'SHOW_COMPLETED':
            return events.filter(event => event.completed); // TODO
        case 'SHOW_ACTIVE':
            return events.completed(event => !event.completed) // TODO
    }
};

const mapStateToProps = state => {
    return {
        mode: state.sidebar,
        labels: state.labels
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(Actions.refreshLabelsIfNeeded());
        },
        generateFeedClick: () => {
            dispatch(Actions.generateICSFeed());
        },
        labelVisibilityToggled: (labelName) => {
            dispatch(Actions.labelVisibilityToggled(labelName));
        },
        homeClicked: () => {
            dispatch(push('/'));
        },
        addEvent: () => {
            dispatch(push('/edit'));
        },
        importICSClicked: () => {
            dispatch(push('/import'));
        }
    }
};

// Connect props to Redux state and actions
const SidebarContainer = connect(mapStateToProps, mapDispatchToProps)(Sidebar);

export default SidebarContainer;