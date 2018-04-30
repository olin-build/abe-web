import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import ReactGA from 'react-ga';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as reducers from './reducers';
import SidebarMode from './sidebar-modes';


export default function setupStore(history) {
  const DEBUG = process.env.DEBUG || false;
  const GA_ID = process.env.GA_ID;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  const initialState = {
    general: {
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
        Day: {
          displayName: 'Day',
          daysVisible: 1,
          calendarModeProp: 'multi-day',
        },
        '3-Day': {
          displayName: '3-Day',
          daysVisible: 3,
          calendarModeProp: 'multi-day',
        },
        Week: {
          displayName: 'Week',
          daysVisible: 7,
          calendarModeProp: 'multi-day',
        },
        Month: {
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
    labels: {
      labelList: null,
      visibleLabels: null,
    },
  };

  initialState.calendar.currentViewMode = isMobile
    ? initialState.calendar.possibleViewModes['3-Day']
    : initialState.calendar.possibleViewModes.Month;

  // Google Analytics
  if (GA_ID) {
    ReactGA.initialize(GA_ID, {
      debug: DEBUG,
    });
    history.listen((event) => {
      // Dispatch page changes to Google Analytics
      ReactGA.set({ page: event.pathname });
      ReactGA.pageview(event.pathname);
    });
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }

  // Load the Redux middleware if the Redux devtools extension is available
  const middleware = (DEBUG && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      routerMiddleware(history),
    ))
    : applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      routerMiddleware(history),
    );

  return createStore(
    combineReducers({ ...reducers, router: routerReducer }),
    initialState,
    middleware,
  );
}
