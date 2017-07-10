import * as React from "react";
import {browserHistory} from 'react-router-dom';
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';
import EventDateTimeSelector from './date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';
import TagEntry from '../../components/tag-entry.jsx';

export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
        this.titleChanged = this.titleChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.startChanged = this.startChanged.bind(this);
        this.endChanged = this.endChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.visibilityChanged = this.visibilityChanged.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.recurrenceSelected = this.recurrenceSelected.bind(this);
        this.recurrenceChanged = this.recurrenceChanged.bind(this);

        this.state = {
            eventData: {
                title: '',
                start: new Date(),
                end: new Date(),
                location: '',
                description: '',
                visibility: 'public',
                labels: []
            },
            recurrence: {
              frequency: 'DAILY',
              interval: '1',
              by_day: '',
            },
            month_option: 'month',
            end_option: 'forever'
        };

        this.state['submitButtonText'] = '';
        if ('match' in props && 'id' in props.match.params) {
            this.state.eventData.id = props.match.params.id;
            this.state.submitButtonText = 'Update Event';
        }
        else if('match' in props && 'sid' in props.match.params){
          this.state.eventData.sid = props.match.params.sid;
          this.state.eventData.rec_id = props.match.params.rec_id;
          this.state.submitButtonText = 'Update Event';
        }
        else {
            this.state.submitButtonText = 'Add Event';
        }

        this.possibleLabels = ['Library', 'OFAC', 'FWOP', 'OARS', 'Robolab', 'StAR', 'PGP', 'Admission', "Candidates' Weekend"];
    }

    componentDidMount() {
      var days = ["SU","MO","TU","WE","TH","FR","SA"];
      let recurrs = this.state.recurrence;
      let recurrs_by_day = [days[this.state.eventData.start.getDay()]];
      recurrs = Object.assign(recurrs, {by_day: recurrs_by_day});
      this.state.eventData.start.setMilliseconds(0);
      this.state.eventData.end.setMilliseconds(0);
      this.setState({recurrence: recurrs});
      let self = this;
      if ('id' in this.state.eventData) {
        $.ajax({
            url: window.abe_url + '/events/' + this.state.eventData.id,
            method: 'GET',
            error: error => alert('Error retrieving event data from server:\n' + error),
            success: data => {
                data = Object.assign(self.state.eventData, data);
                if (!data.labels)
                    data.labels = [];
                self.setState({eventData: data});
            }
        });
      }
      else if ('sid' in this.state.eventData){
        $.ajax({
            url: window.abe_url + '/events/' + this.state.eventData.sid + '/' + this.state.eventData.rec_id,
            method: 'GET',
            error: error => alert('Error retrieving event data from server:\n' + error),
            success: data => {
                  data.start = new Date(data.start);
                  data.end = new Date(data.end);
                  data = Object.assign(this.state.eventData, data);
                    if (!data.labels)
                        data.labels = [];
                  this.setState({eventData: data});
            }
        });
      }
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
        if(value.month_option === 'week'){
          var days = ["SU","MO","TU","WE","TH","FR","SA"];
          state.eventData.recurrence.by_day = [days[state.eventData.start.getDay()]]
        }
        else{
          state.eventData.recurrence.by_month_day = String(state.eventData.start.getDate())
        }
        state = Object.assign(this.state, state);
        this.setState(state);
    }

    recurrenceSelected(){
      let data = this.state.eventData;
      if(data.recurrence){
        data.recurrence = undefined;
      }
      else{
        data.recurrence = this.state.recurrence
      }
      this.setState({eventData: data})
    }

    locationChanged(newValue) {
        let data = this.state.eventData;
        data = Object.assign(data, {location: newValue});
        this.setState({eventData: data});
    }

    descriptionChanged(e) {
        let data = this.state.eventData;
        data = Object.assign(data, {description: e.currentTarget.value});
        this.setState({eventData: data});
    }

    eventSavedSuccessfully(response) {
        let id = JSON.parse(response).id;
        let data = this.state.eventData;
        data = Object.assign(data, {id: id});
        this.setState({eventData: data});
        this.props.history.push('/edit/'+id);
    }

    cancelButtonClicked() {
        window.history.back();
    }

    deleteButtonClicked() {
        if (confirm('Are you sure you want to delete this event?')) {
            $.ajax({
                url: window.abe_url + '/events/' + this.state.eventData.id,
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
        let url = window.abe_url + '/events/';
        let data = this.state.eventData;
        if (data.labels.length === 0)
            data.labels = null;
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(),
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
        let pageTitle = this.state.eventData.id  ?  'Edit Event' : 'Add Event';
        let recurrence = this.state.eventData.recurrence ? <EventRecurrenceSelector reccurs={this.state.eventData.recurrence} month={this.state.month_option} end = {this.state.end_option} onChange={this.recurrenceChanged}/> : null;
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{pageTitle}</h1>
                    <div className="event-info-container">
                        <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box" value={this.state.eventData.title} onChange={this.titleChanged}/>
                        <div className="date-time-container">
                          <EventDateTimeSelector datetime={this.state.eventData.start} onChange={this.startChanged} />
                          <EventDateTimeSelector datetime={this.state.eventData.end} onChange={this.endChanged}/>
                          <input type="checkbox" id='repeats-check' title="Repeats?" checked={this.state.eventData.recurrence} onChange={this.recurrenceSelected}/>
                          <label htmlFor="repeats-check">Repeats?</label>
                          {recurrence}
                          <LocationField value={this.state.eventData.location} onChange={this.locationChanged}/>
                        </div>
                        <textarea id="description" title="Event Description" className="wide-text-box multi-line-text-box" placeholder="Description" value={this.state.eventData.description} onChange={this.descriptionChanged}/>
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>
                        <TagEntry tags={this.state.eventData.labels} onChange={this.labelsChanged} possibleLabels={this.possibleLabels}/>
                        <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData} onSubmit={this.saveButtonClicked} submitButtonText={this.state.submitButtonText}/>
                    </div>
                </div>
            </div>
        );
    }
}
