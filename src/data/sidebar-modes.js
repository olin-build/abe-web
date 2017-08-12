const SidebarModes = {
    LOADING: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: false,
        EVENT_ACTIONS: false,
        EVENT_LABELS_PANE: false,
    },
    CALENDAR_VIEW: {
        LINK_PANE: true,
        FILTER_PANE: true,
        GENERATE_ICS_PANE: true,
        MARKDOWN_GUIDE: false,
        EVENT_ACTIONS: false,
        EVENT_LABELS_PANE: false,
    },
    ADD_EDIT_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: true,
        EVENT_ACTIONS: false,
        EVENT_LABELS_PANE: false,
    },
    VIEW_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: false,
        EVENT_ACTIONS: true,
        EVENT_LABELS_PANE: true,
    },
    IMPORT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: false,
        EVENT_ACTIONS: false,
        EVENT_LABELS_PANE: false,
    }
};

export default SidebarModes;