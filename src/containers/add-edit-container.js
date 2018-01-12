// This container is a sort of middleware between the React page and the Redux data store

import { connect } from 'react-redux';
import {
    setSidebarMode,
    setMarkdownGuideVisibility,
    refreshLabelsIfNeeded,
    toggleSidebarCollapsed,
    setPageTitlePrefix,
    eventSavedSuccessfully,
    eventSaveFailed,
    eventDeletedSuccessfully,
    eventDeleteFailed,
} from '../data/actions';
import AddEditEventPage from '../pages/add-edit/add-edit-page';

// This function passes values/objects from the Redux state to the React component as props
const mapStateToProps = state => {
    return {
        general: state.general,
        // events: getVisibleEvents(state.events, state.labels),
        possibleLabels: state.labels.labelList,
        markdownGuideVisible: state.addEdit.markdownGuideVisible
    }
};

// This function passes functions from /srcs/data/actions.jsx to the React component as props
const mapDispatchToProps = dispatch => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(refreshLabelsIfNeeded());
        },
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        setMarkdownGuideVisibility: visible => {
            dispatch(setMarkdownGuideVisibility(visible));
        },
        toggleSidebarCollapsed: () => {
            dispatch(toggleSidebarCollapsed());
        },
        setPageTitlePrefix: (title) => {
            dispatch(setPageTitlePrefix(title));
        },
        eventSavedSuccessfully: (eventId) => {
            dispatch(eventSavedSuccessfully(eventId));
        },
        eventSaveFailed: (eventData, error) => {
            dispatch(eventSaveFailed(eventData, error));
        },
        eventDeletedSuccessfully: (eventId) => {
            dispatch(eventDeletedSuccessfully(eventId));
        },
        eventDeleteFailed: (eventId, error) => {
            dispatch(eventDeleteFailed(eventId, error));
        },
    }
};

// Connect props to Redux state and actions
const AddEditContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditEventPage);

export default AddEditContainer;
