import * as React from "react";
import {Link} from 'react-router-dom';

class PageHeaderTitle extends React.Component {
    render() {
        return (
            <div className="row header-content">
                <div className="logo-container">
                    <img className="logo" src="/public/assets/olin-logo.png"/>
                </div>
                <h1>Welcome to ABE!</h1>
            </div>
        )
    }
}

class PageHeaderNav extends React.Component {
    render() {
        return (
            <nav className="nav-large row expanded">
                <ul className="row menu vertical medium-horizontal">
                    <li className="menu-text"><Link to="/">Home</Link></li>
                    <li className="menu-text"><Link to="/edit">Add</Link></li>
                    <li className="menu-text"><Link to="/import">Import</Link></li>
                </ul>
            </nav>
        );
    }
}

export default class PageHeader extends React.Component {
    render(props) {
        return (
            <header className="row expanded">
                <PageHeaderTitle/>
                <PageHeaderNav/>
            </header>
        );
    }
}
