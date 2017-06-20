import * as React from "react";

class PageHeaderTitle extends React.Component {
    render() {
        return <h1>Welcome to ABE!</h1>

    }
}

class PageHeaderNav extends React.Component {
    render() {
        return (
            <ul>
                <li><a href="./view">View</a></li>
                <li><a href="./add">Add</a></li>
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