import * as React from "react";
import {browserHistory, Redirect} from 'react-router';
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';
import EventDateTimeSelector from '../../components/date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';
import TagEntry from '../../components/tag-entry.jsx';
import MarkdownEditor from '../../components/markdown-editor.jsx';
import moment from 'moment';
import deepcopy from 'deepcopy';
moment.fn.toJSON = function() { return this.format(); };
moment.fn.toString = function() {return this.format();};
export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
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
        this.getLabels = this.getLabels.bind(this);

        this.state = {
            eventData: {
                title: '',
                start: moment(),
                end: moment(),
                location: '',
                description: '',
                visibility: 'public',
                labels: [],
            },
            seriesData: {},
            recurrence: {
              frequency: 'YEARLY',
              interval: '1',
              by_day: '',
            },
            month_option: 'month',
            end_option: 'forever',
            redirect: false
        };
        this.possibleLabels = [];
        this.state['submitButtonText'] = '';
        if ('match' in props && 'id' in props.match.params) {
            this.state.eventData.id = props.match.params.id;
        }
        else if('match' in props && 'sid' in props.match.params){
          this.state.eventData.sid = props.match.params.sid;
          this.state.eventData.rec_id = props.match.params.rec_id;
        }

        let labels = this.getLabels((labels)=>{
          for (let i in labels){
            this.possibleLabels.push(labels[i].name)
          }
        })
      }

    componentDidMount() {
      var days = ["SU","MO","TU","WE","TH","FR","SA"];
      let recurrs = this.state.recurrence;
      let recurrs_by_day = [days[this.state.eventData.start.day()]];
      recurrs = Object.assign(recurrs, {by_day: recurrs_by_day});
      this.state.eventData.start.milliseconds(0);
      this.state.eventData.end.milliseconds(0);
      this.setState({recurrence: recurrs});
      let self = this;
      if ('id' in this.state.eventData) {
        $.ajax({
            url: window.abe_url + '/events/' + self.state.eventData.id,
            method: 'GET',
            error: error => alert('Error retrieving event data from server:\n' + error),
            success: data => {
                data.start = moment.utc(data.start);
                data.start = data.start.local();
                data.end = moment.utc(data.end);
                data.end = data.end.local();
                data = Object.assign(self.state.eventData, data);
                if (!data.labels)
                    data.labels = [];
                if (self.state.eventData.sid){
                  data.rec_id = moment(data.rec_id);}
                self.setState({eventData: data});
                let seriesData = deepcopy(data);
                seriesData.start = moment(seriesData.start);
                seriesData.end = moment(seriesData.end);
                self.setState({seriesData: seriesData});
            }
        });
      }
      else if ('sid' in this.state.eventData){
        let rec_id = moment.utc(Number(self.state.eventData.rec_id));
        $.ajax({
            url: window.abe_url + '/events/' + self.state.eventData.sid + '/' + rec_id.toString(),
            method: 'GET',
            error: error => alert('Error retrieving event data from server:\n' + error),
            success: data => {
                  data.start = moment.utc(data.start);
                  data.start = data.start.local();
                  data.end = moment.utc(data.end);
                  data.end = data.end.local();
                  data.rec_id = moment.utc(data.rec_id);
                  data.rec_id = data.rec_id.local();
                  data = Object.assign(self.state.eventData, data);
                  if (!data.labels)
                      {data.labels = [];}
                  self.setState({eventData: data});
                  let seriesData = deepcopy(data);
                  self.setState({seriesData: seriesData});
            }
        });
      }
    }

    getLabels(callback){
      let self = this
      $.ajax({
          url: window.abe_url + '/labels/',
          method: 'GET',
          success: callback,
          error: function( jqXHR, textStatus, errorThrown ){
              alert("Error: " + errorThrown);
          }
      });
    }

    titleChanged(e) {
        let data = this.state.eventData;
        data = Object.assign(data, {title: e.currentTarget.value});
        this.setState({eventData: data});
    }

    startChanged(value) {
        let data = this.state.eventData;
        data.start = value;
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
        if(value.month_option === 'week' && value.frequency === 'MONTHLY'){
          var days = ["SU","MO","TU","WE","TH","FR","SA"];
          state.eventData.recurrence.by_day = [days[state.eventData.start.day()]];
          delete state.eventData.recurrence.by_month_day;
        }
        else if(value.month_option === 'month' && value.frequency === 'MONTHLY'){
          state.eventData.recurrence.by_month_day = String(state.eventData.start.date())
          delete state.eventData.recurrence.by_day;
        }
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
      var url
      if (this.state.eventData.id){
        url =  window.abe_url + '/events/' + this.state.eventData.id
      }
      else{

        url = window.abe_url + '/events/' + this.state.eventData.sid + '/' + this.state.eventData.rec_id.toJSON()
      }
        if (confirm('Are you sure you want to delete this event?')) {
            $.ajax({
                url: url,
                method: 'DELETE',
                dataType: 'text',
                contentType: 'text/plain',
                success: alert('Event deleted successfully'),
                error: function( jqXHR, testStatus, errorThrown ){
                    alert("Error: " + errorThrown)
                }
            })
        }
    }

    saveButtonClicked() {
        let data = this.state.eventData;
        // if (data.labels.length === 0)
        //     data.labels = null;
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

    labelsChanged(labels) {
        if (this.state) {
            let data = this.state.eventData;
            data.labels = labels;
            this.setState({eventData: data});
        }
    }

    render() {
        let pageTitle = this.state.eventData.id || this.state.eventData.sid ?  'Edit Event' : 'Add Event';
        let submitButtonText = this.state.eventData.id || this.state.eventData.sid ?  'Update Event' : 'Add Event';
        let recurrence_disable = this.state.eventData.sid ? 'disabled' : null;
        let recurrence = this.state.eventData.recurrence ? <EventRecurrenceSelector reccurs={this.state.eventData.recurrence} month={this.state.month_option} end = {this.state.end_option} onChange={this.recurrenceChanged}/> : null;
        let redirect = this.state.redirect ? <Redirect to='/'/> : null;
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{pageTitle}</h1>
                    {redirect}
                    <div className="event-info-container">
                        <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box" value={this.state.eventData.title} onChange={this.titleChanged}/>
                        <div className="date-time-container">
                          <EventDateTimeSelector buttonPrefix="Start: " datetime={this.state.eventData.start} onChange={this.startChanged} />
                          <EventDateTimeSelector buttonPrefix="End: " datetime={this.state.eventData.end} onChange={this.endChanged}/>
                          <input type="checkbox" id='repeats-check' title="Repeats?" disabled={recurrence_disable} checked={this.state.eventData.recurrence} onChange={this.recurrenceSelected}/>
                          <label htmlFor="repeats-check">Repeats?</label>
                          {recurrence}
                          <LocationField location={this.state.eventData.location} onChange={this.locationChanged}/>
                        </div>
                        <MarkdownEditor source={this.state.eventData.description} onChange={this.descriptionChanged} />
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>
                        <TagEntry tags={this.state.eventData.labels} onChange={this.labelsChanged} possibleLabels={this.possibleLabels}/>
                        <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData || 'sid' in this.state.eventData} onSubmit={this.saveButtonClicked} submitButtonText={submitButtonText}/>
                </div>
            </div>
          </div>
        );
    }
}
