// This page is used to add or edit an event

import * as React from 'react';
import moment from 'moment';
import deepcopy from 'deepcopy';
import axios from 'axios';
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';
import EventDateTimeSelector from '../../components/date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';
import MarkdownEditor from '../../components/markdown-editor.jsx';
import MenuIconButton from '../../components/menu-icon-button.jsx';
import LabelPane from '../../components/label-pane.jsx';
import SidebarModes from '../../data/sidebar-modes';

export default class AddEditEventPage extends React.Component {
  constructor(props) {
    super(props);

    let eventData = props.eventData
      ? deepcopy(props.eventData)
      : null;

    // Check if we need to request data from the server
    if (!eventData && props.match.params.id) {
      props.getEventDataViaUrlParams(props.match.params);
    } else { // Creating a new event
      eventData = {
        title: '',
        start: moment().minutes(0).milliseconds(0),
        end: moment().minutes(0).milliseconds(0).add(1, 'h'),
        allDay: false,
        location: '',
        description: '',
        visibility: 'public',
        labels: [],
      };
    }

    this.state = {
      eventData,
      seriesData: null, // Master/original event data in a series of recurring events
      defaultRecurrence: {
        frequency: 'WEEKLY',
        interval: '1',
        by_day: [moment().format('dd').toUpperCase()],
        month_option: 'month',
        week_option: 'week',
      },
      markdownGuideVisible: true,
      locationRaw: '',
      recurrenceRule: null,
    };

    this.props.setSidebarMode(SidebarModes.ADD_EDIT_EVENT);

    this.props.setPageTitlePrefix(this.props.match.params.id ? 'Edit Event' : 'Add Event');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.eventData) {
      this.setState({ eventData: deepcopy(newProps.eventData) });
    }
    // TODO: If the event is recurring but newProps.match.params.recId is not defined, copy the data to seriesData
  }

    // TODO: Use the logic in here for dealing with recurring events (currently broken)
    receivedSuccessfulResponse = (response) => {
      const eventData = response.data;

      // If the labels are null/undefined, create an empty list in our state
      if (!eventData.labels) { eventData.labels = []; }

      // Convert start strings (in UTC) to local-time Moment.js objects
      eventData.start = moment.utc(eventData.start).local();
      eventData.end = moment.utc(eventData.end).local();

      // Create copy of event data to compare to later to determine changes
      const seriesData = deepcopy(eventData);
      // Create copy of Moment objects
      seriesData.start = moment(seriesData.start).local();
      seriesData.end = moment(seriesData.end).local();

      if (!eventData.id) { // Recurring event
        eventData.rec_id = moment.utc(eventData.rec_id).local(); // rec_id is start time
      }

      this.setState({
        eventData,
        locationRaw: eventData.location,
        seriesData,
      });
    };

    validateInput = () => {
      if (this.state.eventData.title.length === 0) {
        alert('Event Title is required');
        if (this.state.eventData.title.length === 0) {
          alert('Event must have a title');
          return false;
        }

        if (this.state.eventData.labels.length === 0) {
          alert('Event must have at least one label');
          return false;
        }

        return true;
      }
    };

    saveButtonClicked = () => {
      if (this.validateInput()) {
        const { eventData } = this.state;

        // Clean up the event data a bit
        if (eventData.allDay) {
          eventData.start.startOf('day');
          eventData.end.endOf('day');
        }

        // Declare some variables for keeping track of exactly what kind of request we'll be making later
        let url;
        let requestMethod;

        // Check if we're editing an existing event or creating a new one
        if (eventData.id || eventData.sid) { // Existing
          // Check if we're editing a single recurrence of a recurring event
          if (this.state.seriesData) {
            // Determine what's different for this event compared to the rest of the events in the series
            Object.keys(eventData).forEach((key) => {
              // Check if this attribute is the same for all events in the series
              if (eventData[key] === this.state.seriesData[key]) {
                delete eventData[key]; // If so, don't override it for this event
              }
            });

            url = `${window.abe_url}/events/${eventData.id || eventData.sid}/${eventData.recId}`;
          } else {
            url = `${window.abe_url}/events/${eventData.id || eventData.sid}`;
          }
          requestMethod = axios.put;
        } else { // We're adding a new event
          url = `${window.abe_url}/events/`;
          requestMethod = axios.post;
        }

        // Make the request
        requestMethod(url, eventData)
          .then(this.props.eventSavedSuccessfully)
          .catch(jqXHR => this.props.eventSaveFailed(eventData, jqXHR.message));
      }
    };

    titleChanged = e => this.updateEventDatum({ title: e.currentTarget.value });

    locationChanged = (loc) => {
      // Save the processed/cleaned version to the eventData object
      this.updateEventDatum({
        location: loc.isOlin
          ? [loc.building, loc.room, loc.suffix].join(' ').trim()
          : loc.value.trim(),
      });
      // Save the dirty version to be passed on to the text field
      this.setState({ locationRaw: loc.value });
    };

    allDayToggled = e => this.updateEventDatum({ allDay: e.currentTarget.checked });

    setStart = (start) => {
      const timeDelta = start.diff(this.state.eventData.start);
      this.updateEventDatum({
        start,
        // Shift the end time to maintain the same duration
        end: moment(this.state.eventData.end).add(timeDelta, 'ms'),
      });
    };

    setEnd = end => this.updateEventDatum({ end });

    doesRecurToggled = e => this.updateEventDatum({ doesRecur: e.currentTarget.checked });

    recurrenceRuleChanged = recurrenceRule => this.setState({ recurrenceRule });

    descriptionChanged = description => this.updateEventDatum({ description });

    labelToggled = (labelName) => {
      const labels = this.state.eventData.labels.slice(); // Make a copy of the list
      const labelIndex = labels.indexOf(labelName);
      if (labelIndex > 0) { // The label is already on the event
        labels.splice(labelName, 1); // Remove the label
      } else {
        labels.push(labelName); // Add the label
      }
      this.updateEventDatum({ labels });
    };

    visibilityChanged = visibility => this.updateEventDatum({ visibility });

    updateEventDatum = delta => this.setState({ eventData: Object.assign({}, this.state.eventData, delta) });

    render() {
      if (!this.state.eventData) {
        return (
          <div>
            <h1>Loading...</h1>
          </div>
        );
      }

      const editingExisting = this.state.eventData.id || this.state.eventData.sid;
      const pageTitle = editingExisting ? 'Edit Event' : 'Add Event';
      const submitButtonText = editingExisting ? 'Update Event' : 'Add Event';
      const formUrl = 'https://goo.gl/forms/2cqVijokICZ5S20R2';
      return (
        <div className="row content-container">
          <span className="content-container">
            <h1 className="page-title">
              <MenuIconButton onClick={this.props.toggleSidebarCollapsed} tooltip="Show/Hide Sidebar" />
              {pageTitle}
            </h1>
          </span>
          <div className="event-info-container">
            <input
              id="event-title"
              type="text"
              placeholder="Title"
              className="wide-text-box single-line-text-box medium-text-box"
              value={this.state.eventData.title}
              onChange={this.titleChanged}
            />
            <div className="date-time-container">
              <EventDateTimeSelector
                buttonPrefix="Start: "
                datetime={moment(this.state.eventData.start)}
                onChange={this.setStart}
                show={this.state.eventData.allDay ? 'date' : 'both'}
              />
              <EventDateTimeSelector
                buttonPrefix="End: "
                datetime={moment(this.state.eventData.end)}
                onChange={this.setEnd}
                show={this.state.eventData.allDay ? 'date' : 'both'}
              />
              <input
                type="checkbox"
                id="all-day-check"
                title="All Day"
                checked={this.state.eventData.allDay}
                onChange={this.allDayToggled}
              />
              <label htmlFor="all-day-check">All Day</label>
              <input
                type="checkbox"
                id="repeats-check"
                title="Repeats?"
                disabled={this.state.seriesData}
                checked={this.state.eventData.doesRecur}
                onChange={this.doesRecurToggled}
              />
              <label htmlFor="repeats-check">Repeats?</label>
              {this.state.eventData.doesRecur &&
                <EventRecurrenceSelector
                  reccurs={this.state.eventData.recurrenceRule}
                  start={this.state.eventData.start}
                  onChange={this.state.eventData.recurrenceRuleChanged}
                />}
            </div>
            <LocationField location={this.state.eventData.location} onChange={this.locationChanged} />
            <MarkdownEditor source={this.state.eventData.description} onChange={this.descriptionChanged} />
            <EventVisibilitySelector
              visibility={this.state.eventData.visibility}
              onChange={this.visibilityChanged}
            />
            <LabelPane
              contentClass="add-edit-filters"
              selectedLabels={this.state.eventData.labels}
              labelToggled={this.labelToggled}
              {...this.props}
            />
            <span style={{ marginTop: '1em', display: 'block' }} >
                    Need a new label? <a href={formUrl} target="_blank">Request one here</a>.
            </span>
            <SaveCancelButtons
              onCancel={this.props.cancelButtonClicked}
              onDelete={this.props.deleteCurrentEvent}
              showDelete={this.state.eventData.id}
              onSubmit={this.saveButtonClicked}
              submitButtonText={submitButtonText}
            />
          </div>
        </div>
      );
    }
}
