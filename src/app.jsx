import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Router, Route, Switch } from 'react-router'
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { toggleSidebarCollapsed } from './data/actions';

import CalendarContainer from "./containers/calendar-container";
import SidebarContainer from "./containers/sidebar-container";
import AddEditContainer from "./containers/add-edit-container";
import ViewEventContainer from "./containers/event-details-container";
import ImportContainer from "./containers/import-container";
import * as reducers from './data/reducers';
import SidebarMode from "./data/sidebar-modes";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
const initialState = {
    general: {
        currentEvent: null,
        debug: window.debug,
        isMobile,
        pageTitlePrefix: null,
        pageTitleSuffix: 'Olin College Events',
        viewColumns: 3,
    },
    calendar: {
      currentlyViewingDate: null,
      currentViewMode: null, // Set below
      possibleViewModes: {
        'Day': {
          displayName: 'Day',
          daysVisible: 1,
          calendarModeProp: 'multi-day',
        },
        '3-Day': {
          displayName: '3-Day',
          daysVisible: 3,
          calendarModeProp: 'multi-day',
        },
        'Week': {
          displayName: 'Week',
          daysVisible: 7,
          calendarModeProp: 'multi-day',
        },
        'Month': {
          displayName: 'Month',
          daysVisible: -1,
          calendarModeProp: 'month',
        },
      },
    },
    events: {
        current: null,
        events: null,
    },
    sidebar: {
        mode: SidebarMode.LOADING,
        isCollapsed: isMobile,
    },
    addEdit: {
        markdownGuideVisible: true,
    },
    labels: {
        labelList: null,
        visibleLabels: null,
    },
};

initialState.calendar.currentViewMode = isMobile
  ? initialState.calendar.possibleViewModes['3-Day']
  : initialState.calendar.possibleViewModes['Month'];

// React Router (with Redux middleware)
const history = createHistory();

// Google Analytics
if (window.GA_ID) {
    ReactGA.initialize(window.GA_ID, {
        debug: window.debug
    });
    history.listen((event) => {
        // Dispatch page changes to Google Analytics
        ReactGA.set({ page: event.pathname });
        ReactGA.pageview(event.pathname);
    });
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
}

const routeMiddleware = routerMiddleware(history);
let store;
if (window.debug && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    store = createStore(
        combineReducers({...reducers, router: routerReducer}),
        initialState,
        composeEnhancers(applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            routeMiddleware,
        ))
    );
} else {
    store = createStore(
        combineReducers({...reducers, router: routerReducer}),
        initialState,
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            routeMiddleware,
        )
    );
}

ReactDOM.render(
    <Provider store={store}>
        <div className="app-container">
            <SidebarContainer/>
            <div className="scene-container">
                <div className="scene-overlay" onClick={() => store.dispatch(toggleSidebarCollapsed())}/>
                <Router history={history}>
                    <Switch>
                      <Route exact path='/' component={CalendarContainer}/>
                      <Route exact path='/calendar' component={CalendarContainer}/>
                      <Route exact path='/calendar/' component={CalendarContainer}/>
                      <Route path='/calendar/:labels' component={CalendarContainer}/>
                      <Route exact path='/edit' component={AddEditContainer}/>
                      <Route exact path='/edit/:id' component={AddEditContainer}/>
                      <Route path='/edit/:sid/:rec_id' component={AddEditContainer}/>
                      <Route exact path='/import' component={ImportContainer}/>
                      <Route exact path='/edit/:id' component={AddEditContainer}/>
                      <Route path='/edit/:sid/:rec_id' component={AddEditContainer}/>
                      <Route path='/view/:id' component={ViewEventContainer}/>
                    </Switch>
                </Router>
            </div>
        </div>
    </Provider>,
    document.getElementById('app')
);
