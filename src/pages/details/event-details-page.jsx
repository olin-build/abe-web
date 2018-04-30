// This page is used for displaying/viewing event details, location, attachments, etc

import * as React from 'react';
import Markdown from 'react-markdown';
import SidebarModes from '../../data/sidebar-modes';
import PlainEnglishRecurrence from '../../components/plain-english-recurrence.jsx';

export default class EventDetailsPage extends React.Component {
  componentDidMount() {
    // Check if we need to request data from the server
    if (!this.props.eventData) {
      if (this.props.match && this.props.match.params.id) {
        this.props.getEventDataViaUrlParams(this.props.match.params);
      }
      // TODO: Else: display message to the user that they need to specify an event ID
    }

    this.props.setSidebarMode(SidebarModes.VIEW_EVENT);
  }

  render() {
    if (this.props.eventData) {
      const oneDay = this.props.eventData.start.diff(this.props.eventData.end, 'days') === 0;
      const timeFormat = this.props.eventData.allDay ? '' : ' h:mm A';
      const startDateFormat = `ddd, MMM D, YYYY${timeFormat}`;
      const endDateFormat = (oneDay) ? timeFormat : ` ddd, MMM D, YYYY${timeFormat}`;
      const end = this.props.eventData.allDay && oneDay &&
        <span> to<span className="event-start">{this.props.eventData.end.format(endDateFormat)}</span></span>;
      const recurrence = this.props.eventData.recurrence &&
        <PlainEnglishRecurrence recurrence={this.props.eventData.recurrence} start={this.props.eventData.start}/>;
      return (
        <div className="row expanded page-container">
          <div className="row content-container">
            <h1 className="page-title">{this.props.eventData.title}</h1>
            <div className="event-info-container">
              <div className="event-date-location-container">
                <span className="event-start">{this.props.eventData.start.format(startDateFormat)}</span>
                {end}
                {recurrence}
                <p className="event-location">{this.props.eventData.location}</p>
              </div>
              <Markdown source={this.props.eventData.description} className="description-container"/>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="row expanded page-container">
        <div className="row content-container">
          <h1 className="page-title">Loading...</h1>
        </div>
      </div>
    );
  }
}
