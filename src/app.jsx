import * as React from "react";
import {render} from 'react-dom';
import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';
import AddEditEventScene from './scenes/AddEdit/add-edit-event.jsx';
import CalendarScene from './scenes/Calendar/calendar.jsx';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: 'ABE | Olin College of Engineering'}
    }

    setPageTitle(newTitle) {
        this.setState({title: newTitle + ' | Olin College of Engineering'});
    }

    render() {
        return <PageHeader/>
    }
}

const viewState = {
    name: 'view',
    url: './',
    component: () => <CalendarScene/>
};

const addState = {
    name: 'add',
    url: './add',
    component: () => <AddEditEventScene/>
};


//$(document).foundation()
render(
    <UIRouter plugins={[pushStateLocationPlugin]} states={[viewState, addState]}>
        <div>
            <UISrefActive class="active">
                <UISref to="view"><a>View</a></UISref>
            </UISrefActive>
            <UISrefActive class="active">
                <UISref to="add"><a>Add</a></UISref>
            </UISrefActive>

            <UIView/>
        </div>
    </UIRouter>,
    document.getElementById('app')
);