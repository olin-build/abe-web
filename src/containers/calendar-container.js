// This container is a sort of middleware between the React page and the Redux data store

import { connect } from 'react-redux';
import {
    editEvent,
    setSidebarMode,
    toggleSidebarCollapsed,
    setVisibleLabels,
    setPageTitlePrefix,
    setRoute,
    setCurrentEvent,
    setCurrentlyViewingDate,
    page,
    setViewMode,
    viewEvent,
} from '../data/actions';
import CalendarPage from '../pages/calendar/calendar-page';
import { push } from 'react-router-redux';
import moment from 'moment';

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

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => {
  return {
    events: getVisibleEvents(state.events.events, state.labels.visibleLabels, state.labels.labelList),
    labels: state.labels,
    ...state.calendar,
  }
};

// This function passes functions from /srcs/data/actions.jsx to the React component as props
const mapDispatchToProps = dispatch => {
    return {
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        editEvent: (idInfo, editSingleOccurrence=false) => {
            dispatch(editEvent(idInfo.id, idInfo.sid, idInfo.recId, editSingleOccurrence));
        },
        eventClick(calendarEvent) {
            dispatch(setCurrentEvent(calendarEvent));
            const linkSuffix = (calendarEvent.id) ? calendarEvent.id : calendarEvent.sid;
            dispatch(push('/view/'+linkSuffix));
        },
        viewEvent: (event) => {
            dispatch(setCurrentEvent(event));
            dispatch(viewEvent(event));
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
            dispatch(setCurrentlyViewingDate(moment().utcOffset(-480)));
        },
        setViewMode: (mode) => {
            dispatch(setViewMode(mode));
        },
    }
};

// Connect props to Redux state and actions
const CalendarContainer = connect(mapStateToProps, mapDispatchToProps)(CalendarPage);

export default CalendarContainer;