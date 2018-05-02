// This component is the sidebar, which is displayed across the entire app. Its content merely changes when pages are
// changed.

import React, { Component } from 'react';
import Footer from './footer';
import { SidebarHeader } from '../components/sidebar-header';
import SidebarItemContainer from './sidebar-item-wrapper';
import FilterPane from './filter-pane';
import LinkPane from './link-pane';
import GenerateICSPane from './generate-ics-pane';
import MarkdownGuide from './markdown-guide';
import EventActionsPane from './event-actions-pane';
import LabelPane from '../components/label-pane';

export default class Sidebar extends Component {
  render() {
    const mode = this.props.sidebarMode;
    const content = [];

    if (mode.LINK_PANE) {
      content.push(<LinkPane
        addEventClicked={this.props.addEvent}
        importICSClicked={this.props.importICSClicked}
        key="link"
        className="sidebar-item"
      />);
    }

    if (mode.EVENT_ACTIONS) {
      content.push(<EventActionsPane key="event-actions" className="sidebar-item" {...this.props} />);
    }

    if (mode.EVENT_LABELS_PANE) { // For viewing a single event
      const currentEventLabels = this.props.currentEvent ? this.props.currentEvent.labels : null;
      content.push(<SidebarItemContainer
        key="event-labels"
        header="Labels"
      >
        <LabelPane
          editable={false}
          showUnselected={false}
          selectedLabels={currentEventLabels}
          {...this.props}
        />
                   </SidebarItemContainer>);
    }

    if (mode.FILTER_PANE) { // For viewing the calendar
      content.push(<SidebarItemContainer
        key="filter-pane"
        header="Filter"
      >
        <FilterPane {...this.props} />
                   </SidebarItemContainer>);
    }
    if (mode.GENERATE_ICS_PANE) {
      const header = 'Subscribe';
      content.push(<SidebarItemContainer
        key="gen-ics"
        header={header}
      >
        <GenerateICSPane {...this.props} />
                   </SidebarItemContainer>);
    }

    if (mode.MARKDOWN_GUIDE) {
      content.push(<SidebarItemContainer
        key="markdown-guide"
        header="Markdown Guide"
      >
        <MarkdownGuide />
                   </SidebarItemContainer>);
    }

    const sidebarClasses = `app-sidebar${(this.props.isCollapsed) ? ' collapsed' : ' expanded'}`;
    return (
      <div className={sidebarClasses}>
        <div className="sidebar-container">
          <SidebarHeader
            homeClicked={this.props.homeClicked}
            toggleSidebarCollapsed={this.props.toggleSidebarCollapsed}
          />
          <div className="sidebar-content">
            {content}
          </div>
          <Footer class="sidebar-footer" />
        </div>
      </div>
    );
  }
}
