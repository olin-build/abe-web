// eslint-disable-next-line import/no-extraneous-dependencies
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import AddEditContainer from './containers/add-edit-container';
import CalendarContainer from './containers/calendar-container';
import ViewEventContainer from './containers/event-details-container';
import ImportContainer from './containers/import-container';
import LabelsContainer from './containers/labels-container';
import SidebarContainer from './containers/sidebar-container';
import SubscriptionContainer from './containers/subscription-container';
import { withAccountInfo } from './containers/with-server-data';
import {
  clearMessages,
  fetchAccessInfo,
  fetchLabels,
  toggleSidebarCollapsed,
} from './data/actions';
import { initializeAccessToken } from './data/auth';
import setupStore from './data/setup-store';

// React Router (with Redux middleware)
const history = createHistory();

// Set up the Redux store
const store = setupStore(history);

initializeAccessToken();

store.dispatch(fetchAccessInfo());
store.dispatch(fetchLabels());

const App = ({ messages, onMessageClose }) => (
  <div className="app-container">
    <div className={`messages count-${messages.length}`}>
      <span className="closebox big ion-ios-close" onClick={onMessageClose}>
        &nbsp;
      </span>
      {messages.map(({ id, message }) => <p key={id}>{message}</p>)}
    </div>
    <SidebarContainer />
    <div className="scene-container">
      <div className="scene-overlay" onClick={() => store.dispatch(toggleSidebarCollapsed())} />
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={CalendarContainer} />
          <Route path="/calendar/:labels?" component={CalendarContainer} />
          <Route path="/edit/:id?/:recId?" component={AddEditContainer} />
          <Route path="/view/:id/:recId?" component={ViewEventContainer} />
          <Route exact path="/import" component={ImportContainer} />
          <Route exact path="/labels" component={LabelsContainer} />
          <Route path="/subscription/:id" component={SubscriptionContainer} />
        </Switch>
      </Router>
    </div>
  </div>
);

// Guard the entire app, in order to get a single loading indicator instead of
// one for the sidebar and another for the main calendar view
const mapStateToProps = state => ({
  messages: state.messages,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  onMessageClose: (mode) => {
    dispatch(clearMessages(mode));
  },
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withAccountInfo(App));

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('app'),
);
