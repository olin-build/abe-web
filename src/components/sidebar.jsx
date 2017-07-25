import React, {Component} from "react";
import Footer from "./footer.jsx";
import {PageHeaderTitle} from "./header.jsx";
import FilterPane from "./filter-pane.jsx";
import LinkPane from "./link-pane.jsx";

export default class Sidebar extends Component {

    render() {
        let componentVisibility = this.props.mode;
        let content = [];
        if (componentVisibility.LINK_PANE) {
            content.push(<LinkPane addEventClicked={this.props.addEvent} importICSClicked={this.props.importICSClicked} key="link" className="sidebar-item"/>)
        }
        if (componentVisibility.FILTER_PANE) {
            content.push(<FilterPane key="filter" {...this.props}/>);
        }
        return (
            <div className="app-sidebar">
                <PageHeaderTitle homeClicked={this.props.homeClicked} />
                <div className="sidebar-content">
                    {content}
                </div>
                <Footer/>
            </div>
        )
    }

}
