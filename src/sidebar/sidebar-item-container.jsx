import React from "react";

export default class SidebarItemContainer extends React.Component {

    render() {
        return (
            <div className={"sidebar-item "+this.props.className}>
                <div className="sidebar-item-header">
                    {this.props.header}
                </div>
                <div className="sidebar-item-content">
                    {this.props.children}
                </div>
            </div>
        )
    }

}