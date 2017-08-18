import React, {Component} from "react";
import Footer from "../components/footer.jsx";
import {SidebarHeader} from "../components/header.jsx";
import SidebarItemContainer from "../sidebar/sidebar-item-container.jsx";
import FilterPane from "./filter-pane.jsx";
import LinkPane from "./link-pane.jsx";
import GenerateICSPane from '../components/generate-ics-pane.jsx';
import MarkdownGuide from "../scenes/AddEdit/markdown-guide.jsx";
import EventActionsPane from "../scenes/AddEdit/actions-pane.jsx";
import TagPane from "../components/tag-pane.jsx";

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
            content.push(<SidebarItemContainer key="event-labels" header="Tags"><TagPane editable={false} showUnselected={false} {...this.props} selectedLabels={this.props.currentEvent.labels}/></SidebarItemContainer>);
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
