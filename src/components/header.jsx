import * as React from "react";
import {Link} from 'react-router-dom';

class PageHeaderTitle extends React.Component {
    render() {
        return <h1>Welcome to ABE!</h1>

    }
}

class PageHeaderNav extends React.Component {
    render() {
        return (
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/edit">Edit</Link></li>
            </ul>
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