import * as React from "react";
import {browserHistory} from 'react-router-dom';
import axios from "axios";
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import EventDateTimeSelector from './date-time-selector.jsx';
import EventRecurrenceSelector from './recurrence-selector.jsx';

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
        } else {
            this.state.submitButtonText = 'Add Event';
        }
    }

    componentDidMount() {
      var days = ["SU","MO","TU","WE","TH","FR","SA"];
      let recurrs = this.state.recurrence;
      let recurrs_by_day = [days[this.state.eventData.start.getDay()]];
      recurrs = Object.assign(recurrs, {by_day: recurrs_by_day});
      this.state.eventData.start.setMilliseconds(0);
      this.state.eventData.end.setMilliseconds(0);
      this.setState({recurrence: recurrs});
        if ('id' in this.state.eventData) {
            axios.get('https://abeweb.herokuapp.com/events/' + this.state.eventData.id)
                .then(res => {
                    let data = res.data;
                    data.start = new Date(data.start);
                    data.end = new Date(data.end);
                    data = Object.assign(this.state.eventData, data);
                    this.setState({eventData: data});

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
        this.setState(state, ()=>{console.log(this.state); console.log(this.state.eventData); console.log(this.state.eventData.recurrence)});
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

    locationChanged(e) {
        let data = this.state.eventData;
        data = Object.assign(data, {location: e.currentTarget.value});
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
                url: 'https://abeweb-pr-24.herokuapp.com/events/' + this.state.eventData.id,
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
        let url = 'https://abeweb-pr-29.herokuapp.com/events/'; //'https://abeweb-pr-18.herokuapp.com/events/'; // TODO Do this with an environment variable or something
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(this.state.eventData),
            success: response => this.eventSavedSuccessfully(response),
            error: function( jqXHR, textStatus, errorThrown ){
                alert("Error: " + errorThrown);
            }
        });

    }

    visibilityChanged(value) {
        console.log(value);
        let data = this.state.eventData;
        data.visibility = value;
        data = Object.assign(this.state.eventData, data);
        this.setState({eventData: data});
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
                        <EventDateTimeSelector datetime={this.state.eventData.start} onChange={this.startChanged} />
                        <EventDateTimeSelector datetime={this.state.eventData.end} onChange={this.endChanged}/>
                        <input type="checkbox" id='repeats-check' title="Repeats?" checked={this.state.eventData.recurrence} onChange={this.recurrenceSelected}/>
                        <label htmlFor="repeats-check">Repeats?</label>
                        {recurrence}
                        <input id="location" type="text" title="Event Location" className="wide-text-box single-line-text-box medium-text-box" placeholder="Location" value={this.state.eventData.location} onChange={this.locationChanged}/>
                        <textarea id="description" title="Event Description" className="wide-text-box multi-line-text-box" placeholder="Description" value={this.state.eventData.description} onChange={this.descriptionChanged}/>
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>

                        <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData} onSubmit={this.saveButtonClicked} submitButtonText={this.state.submitButtonText}/>
                    </div>
                </div>
            </div>
        );
    }
}
// <div className="date-time-container">
//     <input id="start-date" title="Start Date" type="date" className="single-line-text-box short-text-box" placeholder="Start Date" value={this.state.eventData.start} onChange={this.startDateChanged}/>
//     <input id="start-time" title="Start Time" type="time" className="single-line-text-box short-text-box" placeholder="Start Time" value={this.state.eventData.start} onChange={this.startTimeChanged}/>
//     to
//     <input id="end-date" title="End Date" type="date" className="single-line-text-box short-text-box" placeholder="End Date" value={this.state.eventData.end} onChange={this.endDateChanged}/>
//     <input id="end-time" title="End Time" type="time" className="single-line-text-box short-text-box" placeholder="End Time" value={this.state.eventData.end} onChange={this.endTimeChanged}/>
// </div>
