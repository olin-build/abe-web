import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import createHistory from 'history/createBrowserHistory';
import {
  toggleSidebarCollapsed,
  fetchLabels,
} from './data/actions';
import setupStore from './data/setup-store';
import CalendarContainer from './containers/calendar-container';
import SidebarContainer from './containers/sidebar-container';
import AddEditContainer from './containers/add-edit-container';
import ViewEventContainer from './containers/event-details-container';
import ImportContainer from './containers/import-container';
import SubscriptionContainer from './containers/subscription-container';

// Remove trailing slash, if present
// TODO: change this from a global to a provider pattern.
window.abe_url = process.env.ABE_URL.replace(/\/$/, '');

// React Router (with Redux middleware)
const history = createHistory();

// Set up the Redux store
const store = setupStore(history);

// Fetch the labels
store.dispatch(fetchLabels());

ReactDOM.render(
  <Provider store={store}>
    <div className="app-container">
      <SidebarContainer />
      <div className="scene-container">
        <div className="scene-overlay" onClick={() => store.dispatch(toggleSidebarCollapsed())} />
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={CalendarContainer} />
            <Route path="/calendar/:labels" component={CalendarContainer} />
            <Route path="/edit/:id?/:recId?" component={AddEditContainer} />
            <Route path="/view/:id/:recId?" component={ViewEventContainer} />
            <Route exact path="/import" component={ImportContainer} />
            <Route path="/subscription/:id" component={SubscriptionContainer} />
          </Switch>
        </Router>
      </div>
    </div>
  </Provider>,
  document.getElementById('app'),
);

