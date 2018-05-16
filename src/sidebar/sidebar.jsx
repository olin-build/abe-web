// This component is the sidebar, which is displayed across the entire app. Its
// content merely changes when pages are changed.

import React from 'react';
import LabelPane from '../components/label-pane';
import { SidebarHeader } from '../components/sidebar-header';
import EventActionsPane from './event-actions-pane';
import FilterPane from './filter-pane';
import Footer from './footer';
import GenerateICSPane from './generate-ics-pane';
import LinkPane from './link-pane';
import MarkdownGuide from './markdown-guide';
import SidebarItemContainer from './sidebar-item-wrapper';
import { canSignOut, clearAccessToken } from '../data/auth';

const Sidebar = (props) => {
  const {
    account: { permissions },
    sidebarMode: mode,
  } = props;

  const content = (
    <div>
      {!permissions.has('view_all_events') && (
        <div>
          <p>You are viewing the public calendar.</p>
          <p>
            <a
              href={`${window.abe_url}/oauth/authorize?redirect_uri=${encodeURIComponent(window.location.href)}`}
            >
              Sign in
            </a>{' '}
            to view and add Olin Community events.
          </p>
        </div>
      )}

      {mode.LINK_PANE &&
        permissions.has('add_events') && (
          <LinkPane
            addEventClicked={props.addEvent}
            importICSClicked={props.importICSClicked}
            key="link"
            className="sidebar-item"
          />
        )}

      {mode.EVENT_ACTIONS &&
        permissions.has('edit_events') && (
          <EventActionsPane key="event-actions" className="sidebar-item" {...props} />
        )}

      {mode.EVENT_LABELS_PANE && (
        <SidebarItemContainer key="event-labels" header="Labels">
          <LabelPane
            editable={false}
            showUnselected={false}
            selectedLabels={props.currentEvent ? props.currentEvent.labels : null}
            {...props}
          />
        </SidebarItemContainer>
      )}

      {mode.FILTER_PANE && (
        // For viewing the calendar
        <SidebarItemContainer key="filter-pane" header="Filter">
          <FilterPane {...props} />
        </SidebarItemContainer>
      )}

      {mode.GENERATE_ICS_PANE && (
        <SidebarItemContainer key="gen-ics" header="Subscribe">
          <GenerateICSPane {...props} />
        </SidebarItemContainer>
      )}

      {mode.MARKDOWN_GUIDE && (
        <SidebarItemContainer key="markdown-guide" header="Markdown Guide">
          <MarkdownGuide />
        </SidebarItemContainer>
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
