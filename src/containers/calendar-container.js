import { connect } from 'react-redux';
import {
    setSidebarMode,
    toggleSidebarCollapsed,
    setVisibleLabels,
    setPageTitlePrefix,
    setRoute,
    setCurrentEvent,
    setCurrentlyViewingDate,
    page,
    setViewMode,
} from '../data/actions';
import CalendarScene from '../scenes/Calendar/calendar.jsx';
import { push } from 'react-router-redux';

const getVisibleEvents = (events, visibleLabels, allLabels) => {
    // Filter out events that are not labeled with currently visible labels
    if (!events || !visibleLabels || !allLabels) return null;
    return Object.values(events).filter((event) => {
        for (let i = 0; i < event.labels.length; ++i) {
            const indexOfLabel = visibleLabels.indexOf(event.labels[i]);
            if (indexOfLabel > -1) {
                event.color = allLabels[visibleLabels[indexOfLabel]].color;
                return true; // Event has at least one visible label
            }
        }
        return false; // No labels on this event are currently visible, so don't show
    });
};

const mapStateToProps = state => {
    return {
        events: getVisibleEvents(state.events.events, state.labels.visibleLabels, state.labels.labelList),
        labels: state.labels,
        currentlyViewingDate: state.general.currentlyViewingDate,
        viewMode: state.general.viewMode,
        viewColumns: state.general.viewColumns,
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
        eventClick(calendarEvent) {
            dispatch(setCurrentEvent(calendarEvent));
            const linkSuffix = (calendarEvent.id) ? calendarEvent.id : calendarEvent.sid;
            dispatch(push('/view/'+linkSuffix));
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
        },
        pageLeft: () => {
            dispatch(page(-1));
        },
        pageRight: () => {
            dispatch(page(1));
        },
        showToday: () => {
            dispatch(setCurrentlyViewingDate(moment()));
        }
    }
};

// Connect props to Redux state and actions
const CalendarContainer = connect(mapStateToProps, mapDispatchToProps)(CalendarScene);

export default CalendarContainer;