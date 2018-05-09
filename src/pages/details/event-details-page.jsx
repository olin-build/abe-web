// This page is used for displaying/viewing event details, location, attachments, etc

import * as React from 'react';
import Markdown from 'react-markdown';
import SidebarModes from '../../data/sidebar-modes';
import PlainEnglishRecurrence from '../../components/plain-english-recurrence';

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

  componentWillUnmount() {
    this.props.clearCurrentEvent();
  }

  render() {
    const { eventData: event } = this.props;
    if (!event) {
      return (
        <div className="row expanded page-container">
          <div className="row content-container">
            <h1 className="page-title">Loading...</h1>
          </div>
        </div>
      );
    }

    const oneDay = event.start.diff(event.end, 'days') === 0;
    const timeFormat = event.allDay ? '' : ' h:mm A';
    const startDateFormat = `ddd, MMM D, YYYY${timeFormat}`;
    const endDateFormat = oneDay ? timeFormat : ` ddd, MMM D, YYYY${timeFormat}`;
    const end = !(event.allDay && oneDay) && (
      <span>
        &nbsp;to
        <span className="event-start">{event.end.format(endDateFormat)}</span>
      </span>
    );
    const recurrence = event.recurrence && <PlainEnglishRecurrence recurrence={event.recurrence} start={event.start} />;
    return (
      <div className="row expanded page-container">
        <div className="row content-container">
          <h1 className="page-title">{event.title}</h1>
          <div className="event-info-container">
            <div className="event-date-location-container">
              <span className="event-start">{event.start.format(startDateFormat)}</span>
              {end}
              {recurrence}
              <p className="event-location">{event.location}</p>
            </div>
            <Markdown source={event.description} className="description-container" />
          </div>
        </div>
      </div>
    );
  }
}
