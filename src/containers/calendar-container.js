import { connect } from 'react-redux';
import { setSidebarMode, toggleSidebarCollapsed, setVisibleLabels, setPageTitlePrefix, setRoute } from '../data/actions';
import CalendarScene from '../scenes/Calendar/calendar.jsx';
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
        events: getVisibleEvents(state.events, state.labels),
        labels: state.labels
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
        viewEvent: (linkSuffix) => {
            dispatch(push('/view/'+linkSuffix));
        },
        toggleSidebarCollapsed: () => {
            dispatch(toggleSidebarCollapsed());
        },
        setVisibleLabels: (labels) => {
            dispatch(setVisibleLabels(labels));
        },
        setPageTitlePrefix: (title) => {
            dispatch(setPageTitlePrefix(title));
        },
        setRoute(route) {
            dispatch(setRoute(route));
        }
    }
};

// Connect props to Redux state and actions
const CalendarContainer = connect(mapStateToProps, mapDispatchToProps)(CalendarScene);

export default CalendarContainer;