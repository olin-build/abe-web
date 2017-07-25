const SidebarModes = {
    LOADING: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
    },
    CALENDAR_VIEW: {
        LINK_PANE: true,
        FILTER_PANE: true,
        GENERATE_ICS_PANE: true,
    },
    ADD_EDIT_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
    },
    VIEW_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
    }
};

export default SidebarModes;