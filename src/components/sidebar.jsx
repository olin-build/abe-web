import React, {Component} from "react";
import Footer from "./footer.jsx";
import {PageHeaderTitle} from "./header.jsx";


export default class Sidebar extends Component {



    render() {
        return (
            <div className="app-sidebar">
                <PageHeaderTitle/>
                <div className="sidebar-content">
                    {this.props.content}
                </div>
                <Footer/>
            </div>
        )
    }

}
