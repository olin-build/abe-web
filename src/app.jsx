import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Router, Route, Switch } from 'react-router'
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { toggleSidebarCollapsed } from './data/actions';

import CalendarContainer from "./containers/calendar-container";
import SidebarContainer from "./containers/sidebar-container";
import AddEditContainer from "./containers/add-edit-container";
import ViewEventContainer from "./containers/view-container";
import ImportContainer from "./containers/import-container";
import * as reducers from './data/reducers';
import SidebarMode from "./data/sidebar-modes";
const initialState = {
    sidebar: {
        mode: SidebarMode.LOADING,
        isCollapsed: false
    },
    addEdit: {
        markdownGuideVisible: true,
    },
    labels: {
        labelList: null,
        visibleLabels: null,
    },
};
const history = createHistory();
const rMiddleware = routerMiddleware(history);
const loggerMiddleware = createLogger();
let store = createStore(
    combineReducers({...reducers, router: routerReducer}),
    initialState,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware, // neat middleware that logs actions
        rMiddleware
    ));

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