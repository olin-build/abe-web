import * as React from "react";
import {browserHistory, Redirect} from 'react-router';
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';
import EventDateTimeSelector from '../../components/date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';
import TagEntry from '../../components/tag-entry.jsx';
import MarkdownEditor from '../../components/markdown-editor.jsx';
import LabelPane from '../../components/label-pane.jsx'
import moment from 'moment';
import deepcopy from 'deepcopy';
import axios from 'axios';
import SidebarModes from "../../data/sidebar-modes";
moment.fn.toJSON = function() { return this.format(); };
moment.fn.toString = function() {return this.format();};

export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
        this.receivedSuccessfulResponse = this.receivedSuccessfulResponse.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.startChanged = this.startChanged.bind(this);
        this.endChanged = this.endChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.labelsChanged = this.labelsChanged.bind(this);
        this.visibilityChanged = this.visibilityChanged.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.recurrenceSelected = this.recurrenceSelected.bind(this);
        this.recurrenceChanged = this.recurrenceChanged.bind(this);
        this.getEventURL = this.getEventURL.bind(this);
        this.getLabels = this.getLabels.bind(this);
        this.allDayChanged = this.allDayChanged.bind(this);
        this.state = this.getInitialState();

        // Load the ID(s) for the event
        Object.assign(this.state.eventData, this.getIdFromURL(props));
        //
        // if (this.state.eventData.id || this.state.eventData.sid)
        //     this.updateEventData();
        //

    }

    getInitialState() {
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
            recurrence: recurrence,
            month_option: 'week',
            end_option: 'forever',
            redirect: false,
            possibleLabels: {},
        };
    }

    componentDidMount() {
        this.props.setSidebarMode(SidebarModes.ADD_EDIT_EVENT);

        let getEventDataPromise = (this.state.eventData.id || this.state.eventData.sid) ? this.updateEventData() : null;

        let possibleLabels = {};
        let response = this.getLabels().then((response)=>{
            let labels = response.data
            for (let i in labels){
                let label = labels[i];
                label.default = false;
                possibleLabels[label.name] = label
            }
            this.setState({possibleLabels : possibleLabels}, () => {
              if (getEventDataPromise){
                getEventDataPromise.then(()=>{
                  let state = this.state;
                  for (let i in state.eventData.labels){
                      let name = state.eventData.labels[i]
                      if (name in state.possibleLabels){
                        state.possibleLabels[name].default = true}
                      };
                  this.setState(state);
              })}
            })
          });
    }

    getIdFromURL(props) {
        if ('match' in props && 'id' in props.match.params) {
            return {id: props.match.params.id};
        }
        else if('match' in props && 'sid' in props.match.params){
            return {sid: props.match.params.sid, rec_id: props.match.params.rec_id};
        }
        return null;
    }

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

    updateEventData() {
        // Make the request and register the response handlers
        return axios.get(this.getEventURL()).then(this.receivedSuccessfulResponse).catch(this.requestError);
    }

    getEventURL() {
        let id = this.state.eventData.id;
        let sid = this.state.eventData.sid;
        let rec_id = moment.utc(Number(this.state.eventData.rec_id)).toString(); // Reformat as ms since UNIX epoch

        return window.abe_url + '/events/' + ((id) ? id.toString() : (sid + '/' + rec_id));
    }

    receivedSuccessfulResponse(response) {
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
        this.setState({eventData:eventData, seriesData:seriesData});
    }

    requestError(error) {
        console.error('Error making request for event data:');
        console.error(error);
        alert('Error: ' + error.message);
    }

    getLabels = () => {
      return axios.get(window.abe_url + '/labels/');
    }

    titleChanged(e) {
        let data = this.state.eventData;
        data = Object.assign(data, {title: e.currentTarget.value});
        this.setState({eventData: data});
    }

    startChanged(value) {
        let data = this.state.eventData;
        let diff = value.diff(data.start);
        data.start = value;
        data.end = data.end.add(diff, 'ms');
        data = Object.assign(this.state.eventData, data);
        this.setState({eventData: data});
    }
    endChanged(value) {
      let data = this.state.eventData;
      data.end = value;
      data = Object.assign(this.state.eventData, data);
      this.setState({eventData: data});
    }

    recurrenceChanged(value) {
        let state = this.state;
        state.eventData.recurrence = value.recurrence;
        state.month_option = value.month_option;
        state.end_option = value.end_option;
        state = Object.assign(this.state, state);
        this.setState(state);
    }

    recurrenceSelected(){
      let data = this.state.eventData;
      if(data.recurrence){
        delete data.recurrence;
      }
      else{
        data.recurrence = this.state.recurrence
      }
      this.setState({eventData: data})
    }

    allDayChanged(){
      let data = this.state.eventData;
      data.allDay = !data.allDay;
      this.setState({eventData: data});
    }

    locationChanged(newValue) {
        let data = this.state.eventData;
        data.location = newValue;
        this.setState({eventData: data});
    }

    descriptionChanged(newDesc) {
        let data = this.state.eventData;
        data.description = newDesc;
        this.setState({eventData: data});
    }

    eventSavedSuccessfully(data) {
        // data.start = moment.utc(data.start);
        // data.start = data.start.local();
        // data.end = moment.utc(data.end);
        // data.end = data.end.local();
        this.setState({redirect: true});
    }

    cancelButtonClicked() {
        window.history.back();
    }

    deleteButtonClicked() {
        if (confirm('Are you sure you want to delete this event?')) {
          axios.delete(this.getEventURL()).then(() => {
              alert('Event deleted successfully');
              this.setState({redirect: true});
          }).catch(this.requestError);
        }
    }

    saveButtonClicked() {
        let data = this.state.eventData;
        if (!data.title){
          alert('Event Title is required')
          return
        }
        if (data.allDay){
          data.start.startOf('day');
          data.end.endOf('day');
        }
        var newEvent = new Object
        var url
        var method
        if (!this.state.eventData.id && !this.state.eventData.sid){
          url = window.abe_url + '/events/';
          newEvent = this.state.eventData;
          method = 'POST'
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
          method = 'PUT'
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
        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(newEvent),
            success: response => this.eventSavedSuccessfully(response),
            error: function( jqXHR, textStatus, errorThrown ){
                alert("Error: " + errorThrown);
            }
        });
    }

    visibilityChanged(value) {
        let data = this.state.eventData;
        data.visibility = value;
        data = Object.assign(this.state.eventData, data);
        this.setState({eventData: data});
    }

    labelsChanged(label) {
        if (this.state) {
            let state = this.state;
            state.possibleLabels[label].default = !state.possibleLabels[label].default
            let i = state.eventData.labels.indexOf(label)
            if (i > -1){
              state.eventData.labels.splice(i, 1)
            }
            else{
              state.eventData.labels.push(label)
            }
            this.setState(state);
        }
    }

    render() {
        let pageTitle = this.state.eventData.id || this.state.eventData.sid ?  'Edit Event' : 'Add Event';
        let submitButtonText = this.state.eventData.id || this.state.eventData.sid ?  'Update Event' : 'Add Event';
        let recurrence_disable = this.state.eventData.sid ? 'disabled' : null;
        let recurrence = this.state.eventData.recurrence ? <EventRecurrenceSelector reccurs={this.state.eventData.recurrence} month={this.state.month_option} start = {this.state.eventData.start} end = {this.state.end_option} onChange={this.recurrenceChanged}/> : null;
        let redirect = this.state.redirect ? <Redirect to='/'/> : null;
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{pageTitle}</h1>
                    {redirect}
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
                          <LocationField location={this.state.eventData.location} onChange={this.locationChanged}/>
                        </div>
                        <MarkdownEditor source={this.state.eventData.description} onChange={this.descriptionChanged} />
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>
                        <LabelPane contentClass='add-edit-filters' labelVisibilityToggled={this.labelsChanged} labels={this.state.possibleLabels}/>
                        <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData || 'sid' in this.state.eventData} onSubmit={this.saveButtonClicked} disabled={'UID' in this.state.eventData} submitButtonText={submitButtonText}/>
                </div>
            </div>
          </div>
        );
    }
}

//<TagEntry tags={this.state.eventData.labels} onChange={this.labelsChanged} possibleLabels={this.state.possibleLabels}/>
