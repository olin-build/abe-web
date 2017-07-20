import * as React from "react";
import {render} from 'react-dom';
import * as fullCalendar from 'fullcalendar/dist/fullcalendar';
import Sidebar from './components/sidebar.jsx';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
// import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';
import PageHeader from './components/header.jsx';
import AddEditEventScene from './scenes/AddEdit/add-edit-scene.jsx';
import ImportScene from './scenes/Import/import.jsx';
import CalendarScene from './scenes/Calendar/calendar.jsx';
import ViewEventScene from './scenes/View/view-event-scene.jsx';
import Footer from "./components/footer.jsx";
import * as foundation from '../public/js/vendor/foundation.js'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: 'ABE | Olin College of Engineering', sidebarContent: null};
        this.setSidebarContent = this.setSidebarContent.bind(this);
        this.AppCalendarScene = this.AppCalendarScene.bind(this);
    }

    setPageTitle(newTitle) {
        this.setState({title: newTitle + ' | Olin College of Engineering'});
    }

    setSidebarContent(content) {
        this.setState({sidebarContent: content});
    }

    AppCalendarScene(props) {
        return <CalendarScene setSidebarContent={this.setSidebarContent}/>
    }

    AppAddEditScene(props) {
        return <AppEditScene setSidebarContent={this.setSidebarContent}/>
    }

    render() {
        return (
            <div className="app-container">
                <Sidebar content={this.state.sidebarContent} onSetContent={this.setSidebarContent}/>
                <Switch>
                    <Route exact path='/' component={this.AppCalendarScene}  />
                    <Route exact path='/edit' component={this.AppAddEditEventScene} />
                    <Route exact path= '/import' component={ImportScene} />
                    <Route exact path='/edit/:id' component={AddEditEventScene} />
                    <Route path= '/edit/:sid/:rec_id' component={AddEditEventScene} />
                    <Route path='/view/:id' component={ViewEventScene} />
                </Switch>
            </div>
      );
    }

}

//$(document).foundation()
// Good tutorial for routing: https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf
render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);
