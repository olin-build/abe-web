const SidebarModes = {
    LOADING: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: false,
    },
    CALENDAR_VIEW: {
        LINK_PANE: true,
        FILTER_PANE: true,
        GENERATE_ICS_PANE: true,
        MARKDOWN_GUIDE: false,
    },
    ADD_EDIT_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: true,
    },
    VIEW_EVENT: {
        LINK_PANE: false,
        FILTER_PANE: false,
        GENERATE_ICS_PANE: false,
        MARKDOWN_GUIDE: false,
    }
};

export default SidebarModes;