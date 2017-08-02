import React, {Component} from "react";
import Footer from "../components/footer.jsx";
import {SidebarHeader} from "../components/header.jsx";
import SidebarItemContainer from "../sidebar/sidebar-item-container.jsx";
import LabelPane from "../components/label-pane.jsx";
import LinkPane from "./link-pane.jsx";
import GenerateICSPane from '../components/generate-ics-pane.jsx';

export default class Sidebar extends Component {

    render() {
        let state = this.props.sidebarState;
        let content = [];
        if (state.LINK_PANE) {
            content.push(<LinkPane addEventClicked={this.props.addEvent} importICSClicked={this.props.importICSClicked} key="link" className="sidebar-item"/>)
        }
        if (state.FILTER_PANE) {
          let header = {
            class : 'filter-pane-title sidebar-item-header',
            allNone : {
              class : 'sidebar-title-right'
            },
            content: <span className="sidebar-title-left">Filter</span>,
          };
            content.push(<div key="filter" className="sidebar-item filter-pane"><LabelPane header={header} contentClass='sidebar-item-content' {...this.props}/></div>);
        }
        if (state.GENERATE_ICS_PANE) {
            let header = 'Subscribe';
            content.push(<SidebarItemContainer key="gen-ics" header={header}><GenerateICSPane {...this.props}/></SidebarItemContainer>);
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
