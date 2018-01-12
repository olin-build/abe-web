// This component is the sidebar, which is displayed across the entire app. Its content merely changes when pages are
// changed.

import React, {Component} from "react";
import Footer from "./footer.jsx";
import {SidebarHeader} from "../components/sidebar-header.jsx";
import SidebarItemContainer from "./sidebar-item-wrapper.jsx";
import FilterPane from "./filter-pane.jsx";
import LinkPane from "./link-pane.jsx";
import GenerateICSPane from './generate-ics-pane.jsx';
import MarkdownGuide from "./markdown-guide.jsx";
import EventActionsPane from "./event-actions-pane.jsx";
import LabelPane from "../components/label-pane.jsx";

export default class Sidebar extends Component {

    render() {
        let mode = this.props.sidebarMode;
        let content = [];

        if (mode.LINK_PANE) {
            content.push(<LinkPane addEventClicked={this.props.addEvent} importICSClicked={this.props.importICSClicked} key="link" className="sidebar-item"/>)
        }

        if (mode.EVENT_ACTIONS) {
            content.push(<EventActionsPane key="event-actions" className="sidebar-item" {...this.props}/>);
        }

        if (mode.EVENT_LABELS_PANE) { // For viewing a single event
            const currentEventLabels = this.props.currentEvent ? this.props.currentEvent.labels : null;
            content.push(<SidebarItemContainer key="event-labels" header="Labels"><LabelPane editable={false} showUnselected={false} {...this.props} selectedLabels={currentEventLabels}/></SidebarItemContainer>);
        }

        if (mode.FILTER_PANE) { // For viewing the calendar
            content.push(<SidebarItemContainer key="filter-pane" header="Filter"><FilterPane {...this.props}/></SidebarItemContainer>);
        }
        if (mode.GENERATE_ICS_PANE) {
            let header = 'Subscribe';
            content.push(<SidebarItemContainer key="gen-ics" header={header}><GenerateICSPane {...this.props}/></SidebarItemContainer>);
        }

        if (mode.MARKDOWN_GUIDE) {
            content.push(<SidebarItemContainer key="markdown-guide" header="Markdown Guide"><MarkdownGuide/></SidebarItemContainer>);
        }

        let sidebarClasses = "app-sidebar" + ((this.props.isCollapsed) ? ' collapsed' : ' expanded');
        return (
            <div className={sidebarClasses}>
                <div className="sidebar-container">
                    <SidebarHeader homeClicked={this.props.homeClicked} toggleSidebarCollapsed={this.props.toggleSidebarCollapsed} />
                    <div className="sidebar-content">
                        {content}
                    </div>
                    <Footer class="sidebar-footer"/>
                </div>
            </div>
        )
    }

}
