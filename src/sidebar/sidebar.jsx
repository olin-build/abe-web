// This component is the sidebar, which is displayed across the entire app. Its
// content merely changes when pages are changed.

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import LabelPane from '../components/label-pane';
import SidebarHeader from '../components/sidebar-header';
import { authorizationUrl, canSignOut, clearAccessToken } from '../data/auth';
import EventActionsPane from './event-actions-pane';
import FilterPane from './filter-pane';
import Footer from './footer';
import GenerateICSPane from './generate-ics-pane';
import LinkPane from './link-pane';
import MarkdownGuide from './markdown-guide';
import SidebarItem from './sidebar-item';

const isProtectedEvent = (event, possibleLabels) =>
  event && event.labels.some(label => (possibleLabels[label] || {}).protected);

const olinBuildLogo = (
  <a
    className="olin-build-logo"
    href="https://olin.build"
    target="_blank"
    title="olin.build promotes community software at Olin"
  >
    olin.build
  </a>
);

const Sidebar = (props) => {
  const {
    user: { scope },
    sidebarMode: mode,
  } = props;
  const onSignOut = () => {
    clearAccessToken();
    window.location.reload();
  };
  const sidebarClasses = `app-sidebar${props.isCollapsed ? ' collapsed' : ' expanded'}`;

  const content = (
    <div>
      {!scope.has('read:all_events') && (
        <SidebarItem key="login" header="Sign In">
          <div>
            <p>You are viewing public events.</p>
            <p>
              <a href={authorizationUrl(window.location.href)}>Sign in</a> to {olinBuildLogo} to see
              and add Olin Community events.
            </p>
          </div>
        </SidebarItem>
      )}

      {mode.FILTER_PANE && (
        // For viewing the calendar
        <SidebarItem key="filter-pane" header="Filter Events">
          <FilterPane {...props} />
        </SidebarItem>
      )}

      {mode.LINK_PANE &&
        scope.has('edit:events') && (
          <LinkPane
            addEventClicked={props.addEvent}
            importICSClicked={props.importICSClicked}
            key="link"
            className="sidebar-item"
          />
        )}

      {mode.EVENT_ACTIONS &&
        scope.has('edit:events') &&
        (scope.has('edit:protected_events') ||
          !isProtectedEvent(props.currentEvent, props.possibleLabels)) && (
          <EventActionsPane key="event-actions" className="sidebar-item" {...props} />
        )}

      {mode.EVENT_LABELS_PANE && (
        <SidebarItem key="event-labels" header="Labels">
          <LabelPane
            editable={false}
            showUnselected={false}
            selectedLabels={props.currentEvent ? props.currentEvent.labels : null}
            {...props}
          />
        </SidebarItem>
      )}

      {mode.GENERATE_ICS_PANE && (
        <SidebarItem key="gen-ics" header="Subscribe">
          <GenerateICSPane {...props} />
        </SidebarItem>
      )}

      {mode.MARKDOWN_GUIDE && (
        <SidebarItem key="markdown-guide" header="Markdown Guide">
          <MarkdownGuide />
        </SidebarItem>
      )}

      {canSignOut() && (
        // For viewing the calendar
        <SidebarItem key="logout" header="Sign Out">
          <a onClick={onSignOut}>Sign out</a> of {olinBuildLogo}. While signed out, you will only be
          able to view public events when you are outside the intranet.
        </SidebarItem>
      )}
    </div>
  );

  return (
    <div className={sidebarClasses}>
      <div className="sidebar-container">
        <SidebarHeader
          homeClicked={props.homeClicked}
          ˇ
          toggleSidebarCollapsed={props.toggleSidebarCollapsed}
        />
        <div className="sidebar-content">{content}</div>
        <Footer class="sidebar-footer" onSignOut={canSignOut() && onSignOut} />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  // TODO: DRY w/ add-edit-page.js
  currentEvent: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    start: PropTypes.instanceOf(moment),
    end: PropTypes.instanceOf(moment),
    labels: PropTypes.arrayOf(PropTypes.string),
  }),
  // TODO: DRY w/ label-pane.js
  possibleLabels: PropTypes.objectOf(PropTypes.shape({
    color: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string.isRequired,
    protected: PropTypes.bool,
    visbility: PropTypes.string,
  })),
  sidebarMode: PropTypes.shape({
    LINK_PANE: PropTypes.bool,
    FILTER_PANE: PropTypes.bool,
    GENERATE_ICS_PANE: PropTypes.bool,
    MARKDOWN_GUIDE: PropTypes.bool,
    EVENT_ACTIONS: PropTypes.bool,
    EVENT_LABELS_PANE: PropTypes.bool,
  }).isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  // TODO: DRY w/ add-edit-page.js
  user: PropTypes.shape({ scope: PropTypes.instanceOf(Set) }).isRequired,

  addEvent: PropTypes.func.isRequired,
  deleteCurrentEvent: PropTypes.func.isRequired,
  editCurrentEvent: PropTypes.func.isRequired,
  editEventSeries: PropTypes.func.isRequired,
  homeClicked: PropTypes.func.isRequired,
  icsUrlCopiedToClipboard: PropTypes.func.isRequired,
  importICSClicked: PropTypes.func.isRequired,
  labelToggled: PropTypes.func.isRequired,
  setVisibleLabels: PropTypes.func.isRequired,
  toggleSidebarCollapsed: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
  currentEvent: null,
  possibleLabels: {},
  selectedLabels: [],
};

export default Sidebar;
