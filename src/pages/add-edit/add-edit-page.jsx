// This page is used to add or edit an event

import * as React from "react";
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';
import EventDateTimeSelector from '../../components/date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';
import MarkdownEditor from '../../components/markdown-editor.jsx';
import MenuIconButton from '../../components/menu-icon-button.jsx';
import TagPane from '../../components/label-pane.jsx'
import moment from 'moment';
import deepcopy from 'deepcopy';
import axios from 'axios';
import SidebarModes from "../../data/sidebar-modes";
moment.fn.toJSON = function() { return this.format(); }; // Don't think this is used anymore
moment.fn.toString = function() {return this.format();}; // Don't think this is used anymore

export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();

        // Load the ID(s) for the event
        Object.assign(this.state.eventData, this.getIdFromURL(props));

        // If we're editing an event (determined by checking the URL), then make a server request for its data
        if (this.state.eventData.id || this.state.eventData.sid)
            this.updateEventData();

    }

    getInitialState = () => {
        let defaultStart = moment().minutes(0).milliseconds(0);
        let defaultEnd = defaultStart.clone().add(1, 'h');
        let recurrence = {
            frequency: 'WEEKLY',
            interval: '1',
            by_day: [defaultStart.format('dd').toUpperCase()]
        };

        return {
            eventData: {
                title: '',
                start: defaultStart,
                end: defaultEnd,
                location: '',
                description: '',
                visibility: 'public',
                labels: [],
                allDay: false,
            },
            seriesData: {},
            isOlinLocation: false,
            locationRaw: '',
            recurrence: recurrence,
            month_option: 'week',
            end_option: 'forever',
            redirect: false,
            possibleLabels: {},
        };
     };

    componentDidMount() {
        this.props.setSidebarMode(SidebarModes.ADD_EDIT_EVENT);

        if (this.props.refreshLabelsIfNeeded)
            this.props.refreshLabelsIfNeeded();

        this.props.setPageTitlePrefix(this.state.eventData.id || this.state.eventData.sid ? 'Edit Event' : 'Add Event');
    }

    getIdFromURL = (props) => {
        if ('match' in props && 'id' in props.match.params) {
            return {id: props.match.params.id};
        }
        else if('match' in props && 'sid' in props.match.params){
            return {sid: props.match.params.sid, rec_id: props.match.params.rec_id};
        }
        return null;
    };

    componentWillReceiveProps(nextProps) {
        // Check to see if the ID parameter in the URL has changed
        let oldId = (this.state.eventData.id) ? this.state.eventData.id : this.state.eventData.sid;
        let newId = this.getIdFromURL(nextProps);
        if (oldId !== newId) {
            // URL has changed
            if (newId === null) { // New event
                this.setState(this.getInitialState());
            } else { // Existing event
                let eventData = Object.assign(newId, this.state.eventData);
                this.setState({eventData: eventData}, () => this.updateEventData()); // Set ID and update once state has been set
            }

        }
     }

    updateEventData = () => {
        // Make the request and register the response handlers
        return axios.get(this.getEventURL()).then(this.receivedSuccessfulResponse).catch(this.requestError);
     };

    getEventURL = () => {
        return window.abe_url + '/events/' + this.resolveID(this.state.eventData);
     };

    resolveID = (eventData) => {
        let id = eventData.id;
        let sid = eventData.sid;
        let rec_id = moment.utc(Number(eventData.rec_id)).toString(); // Reformat as ms since UNIX epoch
        return id ? id.toString() : (sid + '/' + rec_id);
    };

    receivedSuccessfulResponse = (response) => {
        let eventData = response.data;

        // If the labels are null/undefined, create an empty list in our state
        if (!eventData.labels)
            eventData.labels = [];

        // Convert start strings (in UTC) to local-time Moment.js objects
        eventData.start = moment.utc(eventData.start).local();
        eventData.end = moment.utc(eventData.end).local();

        // Create copy of event data to compare to later to determine changes
        let seriesData = deepcopy(eventData);
        // Create copy of Moment objects
        seriesData.start = moment(seriesData.start).local();
        seriesData.end = moment(seriesData.end).local();

        if (!eventData.id) { // Recurring event
            eventData.rec_id = moment.utc(eventData.rec_id).local(); // rec_id is start time
        }

        this.setState({
          eventData,
          locationRaw: eventData.location,
          seriesData
        });
     };

    requestError = (error) => {
        console.error('Error making request for event data:');
        console.error(error);
        alert('Error: ' + error.message);
     };

    titleChanged = (e) => {
        let data = this.state.eventData;
        data = Object.assign(data, {title: e.currentTarget.value});
        this.setState({eventData: data});
     };

    startChanged = (value) => {
        let data = this.state.eventData;
        let diff = value.diff(data.start);
        data.start = value;
        data.end = data.end.add(diff, 'ms');
        data = Object.assign(this.state.eventData, data);
        this.setState({eventData: data});
     };
    endChanged = (value) => {
      let data = this.state.eventData;
      data.end = value;
      data = Object.assign(this.state.eventData, data);
      this.setState({eventData: data});
     };

    recurrenceChanged = (value) => {
        let state = this.state;
        state.eventData.recurrence = value.recurrence;
        state.month_option = value.month_option;
        state.end_option = value.end_option;
        state = Object.assign(this.state, state);
        this.setState(state);
     };

    recurrenceSelected = () =>{
      let data = Object.assign({}, this.state.eventData);
      if(data.recurrence){
        delete data.recurrence;
      }
      else{
        data.recurrence = this.state.recurrence
      }
      this.setState({eventData: data})
     };

    allDayChanged = () =>{
      let data = this.state.eventData;
      data.allDay = !data.allDay;
      this.setState({eventData: data});
     };

    locationChanged = (loc) => {
      const state = Object.assign({}, this.state, {
        isOlinLocation: loc.isOlin,
        eventData: Object.assign({}, this.state.eventData, {
          location:  loc.isOlin
            ? [loc.building, loc.room, loc.suffix].join(' ').trim()
            : loc.value.trim(),
        }),
        locationRaw: loc.value,
      });
      this.setState(state);
     };

    descriptionChanged = (newDesc) => {
        let data = this.state.eventData;
        data.description = newDesc;
        this.setState({eventData: data});
     };

    cancelButtonClicked = () => {
        window.history.back();
     };

    deleteButtonClicked = () => {
        if (confirm('Are you sure you want to delete this event?')) {
            axios.delete(this.getEventURL())
            .then(this.props.eventDeletedSuccessfully(this.resolveID(this.state.eventData)))
            .catch(response => this.props.eventDeleteFailed(this.resolveID(this.state.eventData), response));
        }
     };

    saveButtonClicked = () => {
        let data = this.state.eventData;
        if (!data.title){
          alert('Event Title is required')
          return
        }
        if (data.allDay){
          data.start.startOf('day');
          data.end.endOf('day');
        }
        var newEvent = {};
        var url
        let requestMethod;
        if (!this.state.eventData.id && !this.state.eventData.sid){
          url = window.abe_url + '/events/';
          newEvent = data;
          requestMethod = axios.post;
        }
        else{
          for (let key in this.state.eventData){
            if (this.state.seriesData[key]){
              if (this.state.eventData[key].toString() != this.state.seriesData[key].toString()){
                newEvent[key] = this.state.eventData[key]
              }
            }
            else{
              newEvent[key] = this.state.eventData[key]
            }
          }
          requestMethod = axios.put;
        }
        if (this.state.eventData.id){
          url = window.abe_url + '/events/' + this.state.eventData.id;
        }
        else if (this.state.eventData.sid){
          url = window.abe_url + '/events/' + this.state.eventData.sid;
          newEvent.sid = this.state.eventData.sid.toString();
          newEvent.rec_id = this.state.eventData.rec_id.toString();
          newEvent.start = this.state.eventData.start.toString();
          newEvent.end = this.state.eventData.end.toString();
          delete newEvent.recurrence;
        }
        const idInfo = {
            id: this.state.eventData.id,
            sid: this.state.eventData.sid,
            recId: this.state.eventData.rec_id,
        };
        requestMethod(url, newEvent)
          .then(
            _response => this.props.eventSavedSuccessfully(idInfo),
            (jqXHR, _textStatus, _errorThrown) =>
                this.props.eventSaveFailed(newEvent, jqXHR.message)
          );
     };

    visibilityChanged = (value) => {
        let data = this.state.eventData;
        data.visibility = value;
        data = Object.assign(this.state.eventData, data);
        this.setState({eventData: data});
     };

    labelToggled = (labelName) => {

        let labels = this.state.eventData.labels.slice();
        if (labels.includes(labelName)) {
            labels.splice(labels.indexOf(labelName),1);
        } else {
            labels.push(labelName);
        }
        this.setState({
            eventData: Object.assign({}, this.state.eventData, {
                labels
            })
        });
    };

    // componentWillUnmount() {
    //     this.props.setCurrentEvent(null);
    // }

    render() {
        let pageTitle = this.state.eventData.id || this.state.eventData.sid ?  'Edit Event' : 'Add Event';
        let submitButtonText = this.state.eventData.id || this.state.eventData.sid ?  'Update Event' : 'Add Event';
        let recurrence_disable = this.state.eventData.sid ? 'disabled' : null;
        let recurrence = this.state.eventData.recurrence ? <EventRecurrenceSelector reccurs={this.state.eventData.recurrence} month={this.state.month_option} start = {this.state.eventData.start} end = {this.state.end_option} onChange={this.recurrenceChanged}/> : null;
        return (
            <div className="row content-container">
                <span className="content-container">
                <h1 className="page-title"><MenuIconButton onClick={this.props.toggleSidebarCollapsed} tooltip="Show/Hide Sidebar"/>{pageTitle}</h1>
                </span>
                <div className="event-info-container">
                    <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box" value={this.state.eventData.title} onChange={this.titleChanged}/>
                    <div className="date-time-container">
                      <EventDateTimeSelector buttonPrefix="Start: " datetime={moment(this.state.eventData.start)} onChange={this.startChanged} show={this.state.eventData.allDay ? 'date' : 'both'}/>
                      <EventDateTimeSelector buttonPrefix="End: " datetime={moment(this.state.eventData.end)} onChange={this.endChanged} show={this.state.eventData.allDay ? 'date' : 'both'}/>
                      <input type="checkbox" id='all-day-check' title="All Day" checked={this.state.eventData.allDay} onChange={this.allDayChanged}/>
                      <label htmlFor="all-day-check">All Day</label>
                      <input type="checkbox" id='repeats-check' title="Repeats?" disabled={recurrence_disable} checked={this.state.eventData.recurrence} onChange={this.recurrenceSelected}/>
                      <label htmlFor="repeats-check">Repeats?</label>
                      {recurrence}
                    </div>
                    <LocationField location={this.state.locationRaw} onChange={loc => this.locationChanged(loc)}/>
                    <MarkdownEditor source={this.state.eventData.description} onChange={this.descriptionChanged} setMarkdownGuideVisibility={this.props.setMarkdownGuideVisibility} markdownGuideVisible={this.props.markdownGuideVisible} />
                    <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>
                    <TagPane contentClass='add-edit-filters' selectedLabels={this.state.eventData.labels} labelToggled={this.labelToggled} {...this.props}/>
                    <span style={{marginTop: '1em',display: 'block'}}>Need a new label? <a href="https://goo.gl/forms/2cqVijokICZ5S20R2" target="_blank">Request one here</a>.</span>
                    <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData || 'sid' in this.state.eventData} onSubmit={this.saveButtonClicked} disabled={'UID' in this.state.eventData} submitButtonText={submitButtonText}/>
            </div>
          </div>
        );
    }
}
