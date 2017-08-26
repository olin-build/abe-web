import { connect } from 'react-redux';
import Sidebar from '../sidebar/sidebar.jsx';
import * as Actions from '../data/actions';
import { push } from 'react-router-redux';
import ReactGA from 'react-ga';

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
        general: state.general,
        currentEvent: state.events.current,
        isCollapsed: state.sidebar.isCollapsed,
        sidebarMode: state.sidebar.mode,
        possibleLabels: state.labels.labelList,
        selectedLabels: state.labels.visibleLabels,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(Actions.refreshLabelsIfNeeded());
        },
        labelToggled: (labelName) => {
            dispatch(Actions.labelVisibilityToggled(labelName));
        },
        homeClicked: () => {
            dispatch(push('/'));
        },
        addEvent: () => {
            dispatch(push('/edit'));
        },
        editEvent: (idSuffix) => {
            dispatch(push('/edit/' + idSuffix));
        },
        importICSClicked: () => {
            dispatch(push('/import'));
        },
        toggleSidebarCollapsed: () => {
            dispatch(Actions.toggleSidebarCollapsed());
        },
        setVisibleLabels: (labels, allNoneDefault) => {
            dispatch(Actions.setVisibleLabels(labels, allNoneDefault));
        },
        icsUrlCopiedToClipboard: (url) => {
            ReactGA.event({
                category: 'ICS Feed URL Copied to Clipboard',
                action: url,
            });
        },
    }
};

// Connect props to Redux state and actions
const SidebarContainer = connect(mapStateToProps, mapDispatchToProps)(Sidebar);

export default SidebarContainer;