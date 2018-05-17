// This page is used to add or edit an event

import axios from 'axios';
import deepcopy from 'deepcopy';
import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import DateTimeSelector from '../../components/date-time-selector';
import LabelPane from '../../components/label-pane';
import MarkdownEditor from '../../components/markdown-editor';
import MenuIconButton from '../../components/menu-icon-button';
import { encodeEvent } from '../../data/encoding';
import SidebarModes from '../../data/sidebar-modes';
import LocationField from './location-field';
import RecurrenceSelector from './recurrence-selector';
import SaveCancelButtons from './save-cancel-buttons';
import EventVisibilitySelector from './visibility-selector';

export default class AddEditEventPage extends React.Component {
  constructor(props) {
    super(props);

    let eventData = props.eventData ? deepcopy(props.eventData) : null;

    // If we want to edit a recurring series definition but we have a data for a specific recurrence
    // in that series, we need to fetch the original series data
    if (eventData && eventData.recId && !props.match.params.recId) {
      eventData = null;
    }

    // Check if we need to request data from the server
    if (!eventData && props.match.params.id) {
      props.getEventDataViaUrlParams(props.match.params);
    } else {
      // Creating a new event
      eventData = {
        title: '',
        start: moment()
          .minutes(0)
          .seconds(0)
          .milliseconds(0),
        end: moment()
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .add(1, 'h'),
        allDay: false,
        location: '',
        description: '',
        visibility: 'public',
        labels: [],
        recurrence: null,
      };
    }

    if (props.match.params.id && props.match.params.recId) {
      // Editing a specific recurrence in a series of events
      // Get the series data so we know how this event differs from the rest in the series
      axios
        .get(`${window.abe_url}/events/${props.match.params.id}`)
        .then(this.receivedSuccessfulSeriesDataResponse);
      // TODO: Handle an unsuccessful response
    }

    this.state = {
      eventData,
      seriesData: null, // Master/original event data in a series of recurring events
      defaultRecurrence: {
        frequency: 'WEEKLY',
        interval: '1',
        by_day: [
          moment()
            .format('dd')
            .toUpperCase(),
        ],
        month_option: 'month',
        week_option: 'week',
      },
      locationRaw: eventData ? eventData.location : '',
    };

    this.props.setSidebarMode(SidebarModes.ADD_EDIT_EVENT);

    this.props.setPageTitlePrefix(this.props.match.params.id ? 'Edit Event' : 'Add Event');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.eventData) {
      this.setState({
        eventData: deepcopy(newProps.eventData),
        locationRaw: newProps.eventData.location,
      });
    }
    // TODO: If the event is recurring but newProps.match.params.recId is not
    // defined, copy the data to seriesData
  }

  componentWillUnmount() {
    this.props.clearCurrentEvent();
  }

  setStart = (start) => {
    const timeDelta = start.diff(this.state.eventData.start);
    this.updateEventDatum({
      start,
      // Shift the end time to maintain the same duration
      end: moment(this.state.eventData.end).add(timeDelta, 'ms'),
    });
  };

  setEnd = end => this.updateEventDatum({ end });

  validateInput = () => {
    if (this.state.eventData.title.length === 0) {
      alert('Event Title is required');
      return false;
    }

    if (this.state.eventData.title.length === 0) {
      alert('Event must have a title');
      return false;
    }

    if (this.state.eventData.labels.length === 0) {
      alert('Event must have at least one label');
      return false;
    }

    return true;
  };

  saveButtonClicked = () => {
    if (this.validateInput()) {
      const { eventData } = this.state;

      // Clean up the event data a bit
      if (eventData.allDay) {
        eventData.start.startOf('day');
        eventData.end.endOf('day');
      }

      // Declare some variables for keeping track of exactly what kind of
      // request we'll be making later
      let url;
      let requestMethod;

      // Check if we're editing an existing event or creating a new one
      if (eventData.id || eventData.sid) {
        // Existing
        // Check if we're editing a single recurrence of a recurring event
        if (this.state.seriesData) {
          // Determine what's different for this event compared to the rest of
          // the events in the series
          Object.keys(eventData).forEach((key) => {
            // Check if this attribute is the same for all events in the series
            if (_.isEqual(eventData[key], this.state.seriesData[key])) {
              delete eventData[key]; // If so, don't override it for this event
            }
          });

          url = `${window.abe_url}/events/${eventData.id || eventData.sid}/${
            this.props.match.params.recId
          }`;
        } else {
          url = `${window.abe_url}/events/${eventData.id || eventData.sid}`;
        }
        delete eventData.color; // Don't send the color used for rendering the calendar
        requestMethod = axios.put;
      } else {
        // We're adding a new event
        url = `${window.abe_url}/events/`;
        requestMethod = axios.post;
      }

      // Make the request
      requestMethod(url, encodeEvent(eventData))
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

  receivedSuccessfulSeriesDataResponse = (response) => {
    const seriesData = response.data;

    const { eventData } = this.state;
    if (eventData) {
      // Save the original start and end times in the series data (to check
      // later if the user changed it)
      seriesData.start = moment(eventData.start);
      seriesData.end = moment(eventData.end);
    }

    this.setState({ seriesData });
  };

  doesRecurToggled = e =>
    this.updateEventDatum({
      recurrence: e.currentTarget.checked ? deepcopy(this.state.defaultRecurrence) : null,
    });

  recurrenceRuleChanged = recurrence => this.updateEventDatum({ recurrence });

  descriptionChanged = description => this.updateEventDatum({ description });

  labelToggled = (labelName) => {
    const labels = this.state.eventData.labels.slice(); // Make a copy of the list
    const labelIndex = labels.indexOf(labelName);
    if (labelIndex > -1) {
      // The label is already on the event
      labels.splice(labelIndex, 1); // Remove the label
    } else {
      labels.push(labelName); // Add the label
    }
    this.updateEventDatum({ labels });
  };

  visibilityChanged = visibility => this.updateEventDatum({ visibility });

  updateEventDatum = delta =>
    this.setState({ eventData: Object.assign({}, this.state.eventData, delta) });

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
            <MenuIconButton
              onClick={this.props.toggleSidebarCollapsed}
              tooltip="Show/Hide Sidebar"
            />
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
            <DateTimeSelector
              buttonPrefix="Start: "
              datetime={moment(this.state.eventData.start)}
              onChange={this.setStart}
              show={this.state.eventData.allDay ? 'date' : 'both'}
            />
            <DateTimeSelector
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
              checked={!!this.state.eventData.recurrence}
              onChange={this.doesRecurToggled}
            />
            <label htmlFor="repeats-check">Repeats?</label>
            {this.state.eventData.recurrence && (
              <RecurrenceSelector
                recurs={this.state.eventData.recurrence}
                start={this.state.eventData.start}
                onChange={this.state.eventData.recurrenceRuleChanged}
              />
            )}
          </div>
          <LocationField location={this.state.locationRaw} onChange={this.locationChanged} />
          <MarkdownEditor
            source={this.state.eventData.description}
            onChange={this.descriptionChanged}
          />
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
          <span style={{ marginTop: '1em', display: 'block' }}>
            Need a new label?{' '}
            <a href={formUrl} target="_blank">
              Request one here
            </a>.
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
