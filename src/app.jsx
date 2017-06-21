import * as React from "react";
import {render} from 'react-dom';
import customCalendar from './calendar.js';
import * as fullCalendar from 'fullcalendar/dist/fullcalendar';
// require('bootstrap');
// import * as bootstrap from 'bootstrap/js/button.js';
import * as foundation from '../js/vendor/foundation.js'
import {BrowserRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom';
// import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';
import PageHeader from './components/header.jsx';
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
        return (
        <div>
        <PageHeader/>
        <Calendar/>
        </div>
      );
    }
}

class Calendar extends React.Component {

  componentDidMount(){
    var mycalendar; //THIS IS IMPORTANT because JS sucks at handling classes
    mycalendar = new customCalendar();
    mycalendar.initCalendar();
    mycalendar.makeDropdown();
    mycalendar.populateDropdown();
    mycalendar.refreshFilters([]);
  }
  render(){
    return (
      <div>
        <div id='calendar'></div>
      </div>

    );
  }
}


const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={CalendarScene} />
            <Route path='/edit' component={AddEditEventScene} />
        </Switch>
    </main>
);

//$(document).foundation()
render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);
