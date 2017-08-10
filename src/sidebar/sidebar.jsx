import React, {Component} from "react";
import Footer from "../components/footer.jsx";
import {SidebarHeader} from "../components/header.jsx";
import SidebarItemContainer from "../sidebar/sidebar-item-container.jsx";
import FilterPane from "./filter-pane.jsx";
import LinkPane from "./link-pane.jsx";
import GenerateICSPane from '../components/generate-ics-pane.jsx';
import MarkdownGuide from "../scenes/AddEdit/markdown-guide.jsx";

export default class Sidebar extends Component {

    render() {
        let state = this.props.sidebarState;
        let content = [];

        if (state.LINK_PANE) {
            content.push(<LinkPane addEventClicked={this.props.addEvent} importICSClicked={this.props.importICSClicked} key="link" className="sidebar-item"/>)
        }
        if (state.FILTER_PANE) {
            content.push(<SidebarItemContainer key="filter-pane" header="Filter"><FilterPane {...this.props}/></SidebarItemContainer>);
        }
        if (state.GENERATE_ICS_PANE) {
            let header = 'Subscribe';
            content.push(<SidebarItemContainer key="gen-ics" header={header}><GenerateICSPane {...this.props}/></SidebarItemContainer>);
        }

        if (state.MARKDOWN_GUIDE) {
            content.push(<SidebarItemContainer key="markdown-guide" header="Markdown Guide"><MarkdownGuide/></SidebarItemContainer>);
        }

        let sidebarClasses = "app-sidebar" + ((state.isCollapsed) ? ' collapsed' : ' expanded');
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
