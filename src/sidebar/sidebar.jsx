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

const Sidebar = (props) => {
  const mode = props.sidebarMode;
  const content = [];

  if (mode.LINK_PANE) {
    content.push(<LinkPane
      addEventClicked={props.addEvent}
      importICSClicked={props.importICSClicked}
      key="link"
      className="sidebar-item"
    />);
  }

  if (mode.EVENT_ACTIONS) {
    content.push(<EventActionsPane key="event-actions" className="sidebar-item" {...props} />);
  }

  if (mode.EVENT_LABELS_PANE) {
    // For viewing a single event
    const currentEventLabels = props.currentEvent ? props.currentEvent.labels : null;
    content.push(<SidebarItemContainer key="event-labels" header="Labels">
        <LabelPane
          editable={false}
          showUnselected={false}
          selectedLabels={currentEventLabels}
          {...props}
        />
                 </SidebarItemContainer>);
  }

  if (mode.FILTER_PANE) {
    // For viewing the calendar
    content.push(<SidebarItemContainer key="filter-pane" header="Filter">
        <FilterPane {...props} />
                 </SidebarItemContainer>);
  }
  if (mode.GENERATE_ICS_PANE) {
    const header = 'Subscribe';
    content.push(<SidebarItemContainer key="gen-ics" header={header}>
        <GenerateICSPane {...props} />
                 </SidebarItemContainer>);
  }

  if (mode.MARKDOWN_GUIDE) {
    content.push(<SidebarItemContainer key="markdown-guide" header="Markdown Guide">
        <MarkdownGuide />
                 </SidebarItemContainer>);
  }

  const sidebarClasses = `app-sidebar${props.isCollapsed ? ' collapsed' : ' expanded'}`;
  return (
    <div className={sidebarClasses}>
      <div className="sidebar-container">
        <SidebarHeader
          homeClicked={props.homeClicked}
          toggleSidebarCollapsed={props.toggleSidebarCollapsed}
        />
        <div className="sidebar-content">{content}</div>
        <Footer class="sidebar-footer" />
      </div>
    </div>
  );
};

export default Sidebar;
