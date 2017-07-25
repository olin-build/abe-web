import * as React from "react";
import {Link} from 'react-router-dom';
import OlinLogo from 'svg-react-loader?name=Icon!../../assets/olin-logo.svg';

export class PageHeaderTitle extends React.Component {
    render() {
        return (
            <div className="header-content">
                <a onClick={this.props.homeClicked} alt="Home" title="Home"><OlinLogo className="olin-logo"/></a>
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
