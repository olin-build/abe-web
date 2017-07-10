import * as React from "react";
import {render} from 'react-dom';
import * as fullCalendar from 'fullcalendar/dist/fullcalendar';
// require('bootstrap');
// import * as bootstrap from 'bootstrap/js/button.js';
import * as qtip from '../js/vendor/jquery.qtip.js'
import {BrowserRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom';
// import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';
import PageHeader from './components/header.jsx';
import AddEditEventScene from './scenes/AddEdit/add-edit-scene.jsx';
import ImportScene from './scenes/Import/import.jsx';
import CalendarScene from './scenes/Calendar/calendar.jsx';
import Footer from "./components/footer.jsx";
import * as foundation from '../js/vendor/foundation.js'

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
              <div className="wrapper">
                  <PageHeader/>
                  <Main/>
              </div>
              <Footer/>
          </div>
      );
    }
}

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={CalendarScene} />
            <Route exact path='/edit' component={AddEditEventScene} />
            <Route exact path= '/import' component={ImportScene} />
            <Route exact path='/edit/:id' component={AddEditEventScene} />
            <Route path= '/edit/:sid/:rec_id' component={AddEditEventScene} />
        </Switch>
    </main>
);

//$(document).foundation()
// Good tutorial for routing: https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf
render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);
