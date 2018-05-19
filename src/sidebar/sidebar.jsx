// This component is the sidebar, which is displayed across the entire app. Its
// content merely changes when pages are changed.

import React from 'react';
import LabelPane from '../components/label-pane';
import SidebarHeader from '../components/sidebar-header';
import { canSignOut, clearAccessToken } from '../data/auth';
import EventActionsPane from './event-actions-pane';
import FilterPane from './filter-pane';
import Footer from './footer';
import GenerateICSPane from './generate-ics-pane';
import LinkPane from './link-pane';
import MarkdownGuide from './markdown-guide';
import SidebarItem from './sidebar-item';

const isProtectedEvent = (event, possibleLabels) =>
  event && event.labels.some(label => (possibleLabels[label] || {}).protected);

const Sidebar = (props) => {
  const {
    user: { scope },
    sidebarMode: mode,
  } = props;

  const oauthBaseUrl = `${window.abe_url}/oauth/authorize`;
  const oauthUrl = `${oauthBaseUrl}?redirect_uri=${encodeURIComponent(window.location.href)}`;
  const content = (
    <div>
      {!scope.has('read:all_events') && (
        <SidebarItem key="login" header="Sign In">
          <div>
            <p>You are viewing the public calendar.</p>
            <p>
              <a href={oauthUrl}>Sign in</a> to view and add Olin Community events.
            </p>
          </div>
        </SidebarItem>
      )}

      {mode.LINK_PANE &&
        scope.has('create:events') && (
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

      {mode.FILTER_PANE && (
        // For viewing the calendar
        <SidebarItem key="filter-pane" header="Filter">
          <FilterPane {...props} />
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
    </div>
  );

  const onSignOut = () => {
    clearAccessToken();
    window.location.reload();
  };
  const sidebarClasses = `app-sidebar${props.isCollapsed ? ' collapsed' : ' expanded'}`;
  return (
    <div className={sidebarClasses}>
      <div className="sidebar-container">
        <SidebarHeader
          homeClicked={props.homeClicked}
          toggleSidebarCollapsed={props.toggleSidebarCollapsed}
        />
        <div className="sidebar-content">{content}</div>
        <Footer class="sidebar-footer" onSignOut={canSignOut() && onSignOut} />
      </div>
    </div>
  );
};

export default Sidebar;
