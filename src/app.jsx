import * as React from "react";
import {render} from 'react-dom';

class PageHeaderTitle extends React.Component {
    render() {
        return <h1>Welcome to ABE!</h1>

    }
}

class PageHeaderNav extends React.Component {
    render() {
        return <p>A nav menu should go here...</p>
    }
}

class PageHeader extends React.Component {
    render() {
        return (
            <header>
                <PageHeaderTitle/>
                <PageHeaderNav/>
            </header>
        );
    }
}

class App extends React.Component {
    render() {
        return <PageHeader/>
    }
}

$(document).foundation()
render(<App/>, document.getElementById('app'));