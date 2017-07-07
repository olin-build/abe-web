import * as React from "react";
import {browserHistory} from 'react-router-dom';
import axios from "axios";
import EventVisibilitySelector from './visibility-selector.jsx';
import SaveCancelButtons from './save-cancel-buttons.jsx';
import LocationField from './location-field.jsx';

export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
        this.titleChanged = this.titleChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.visibilityChanged = this.visibilityChanged.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);


        this.state = {
            eventData: {
                title: '',
                location: '',
                description: '',
                visibility: 'public'
            },
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: ''
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
        let self = this;
        if ('id' in this.state.eventData) {
            $.ajax({
                url: window.abe_url + '/events/' + this.state.eventData.id,
                method: 'GET',
                error: (error) => alert('Error retrieving event data from server:\n' + error),
                success: data => {
                    data = Object.assign(self.state.eventData, data);
                    self.setState({eventData: data});
                }
            });
        }
    }

    titleChanged(e) {
        let data = this.state.eventData;
        data = Object.assign(data, {title: e.currentTarget.value});
        this.setState({eventData: data});
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
        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'text',
            contentType: 'text/plain',
            data: JSON.stringify(this.state.eventData),
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

    render() {
        let pageTitle = this.state.eventData.id  ?  'Edit Event' : 'Add Event';
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{pageTitle}</h1>

                    <div className="event-info-container">
                        <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box" value={this.state.eventData.title} onChange={this.titleChanged}/>
                        <div className="date-time-container">
                            <input id="start-date" title="Start Date" type="date" className="single-line-text-box short-text-box" placeholder="Start Date" value={this.state.eventData.startDate}/>
                            <input id="start-time" title="Start Time" type="time" className="single-line-text-box short-text-box" placeholder="Start Time" value={this.state.eventData.startTime}/>
                            to
                            <input id="end-date" title="End Date" type="date" className="single-line-text-box short-text-box" placeholder="End Date" value={this.state.eventData.endDate}/>
                            <input id="end-time" title="End Time" type="time" className="single-line-text-box short-text-box" placeholder="End Time" value={this.state.eventData.endTime}/>
                        </div>
                        <LocationField value={this.state.eventData.location} onChange={this.locationChanged}/>
                        <textarea id="description" title="Event Description" className="wide-text-box multi-line-text-box" placeholder="Description" value={this.state.eventData.description} onChange={this.descriptionChanged}/>
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>

                        <SaveCancelButtons onCancel={this.cancelButtonClicked} onDelete={this.deleteButtonClicked} showDelete={'id' in this.state.eventData} onSubmit={this.saveButtonClicked} submitButtonText={this.state.submitButtonText}/>
                    </div>
                </div>
            </div>
        );
    }
}
