import * as React from "react";
import axios from "axios";
import EventVisibilitySelector from './visibility-selector.jsx';

export default class AddEditEventScene extends React.Component {

    constructor(props) {
        super(props);
        this.titleChanged = this.titleChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.visibilityChanged = this.visibilityChanged.bind(this);

        this.state = {
            eventData: {
                title: '',
                location: '',
                description: '',
                visibility: 'students'
            },
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: ''
        };
        if ('match' in props && 'id' in props.match.params) {
            this.state.eventData.id = props.match.params.id;
        }
    }

    componentDidMount() {
        if ('id' in this.state.eventData) {
            axios.get('https://abeweb.herokuapp.com/events/' + this.state.eventData.id)
                .then(res => {
                    let data = res.data;
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

    addButtonClicked() {
        let title = $('#event-title').val();
        let startDate = $('#start-date').val();
        let startTime = $('#start-time').val();
        let start = new Date(startDate + " " + startTime);
        let endDate = $('#end-date').val();
        let endTime = $('#end-time').val();
        let end = new Date(endDate + " " + endTime);
        let location = $('#location').val();
        let description = $('#description').val();
        let visibility = $('input[name=privacy]:checked').val();
        let data = {
            title: title,
            start: start,
            end: end,
            location: location,
            description: description,
            visibility: visibility
        };
        let url = 'https://abeweb-pr-18.herokuapp.com/events/'; // TODO Do this with an environment variable or something
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'text',
            contentType: 'text/plain',
            data: JSON.stringify(data),
            success: function( data ){
                alert("Event saved!");
            },
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
        // console.log("match is " + (('match' in this.props) ? 'in' :'not in') + " this.props");
        let id = ('props' in this && 'match' in this.props) ? this.props.match.params.id : null;
        // console.log(this.props.match)
        let title = id  ?  'Edit Event' : 'Add Event';
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{title}</h1>

                    <div className="event-info-container">
                        <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box" value={this.state.eventData.title} onChange={this.titleChanged}/>
                        <div className="date-time-container">
                            <input id="start-date" title="Start Date" type="date" className="single-line-text-box short-text-box" placeholder="Start Date" value={this.state.eventData.startDate}/>
                            <input id="start-time" title="Start Time" type="time" className="single-line-text-box short-text-box" placeholder="Start Time" value={this.state.eventData.startTime}/>
                            to
                            <input id="end-date" title="End Date" type="date" className="single-line-text-box short-text-box" placeholder="End Date" value={this.state.eventData.endDate}/>
                            <input id="end-time" title="End Time" type="time" className="single-line-text-box short-text-box" placeholder="End Time" value={this.state.eventData.endTime}/>
                        </div>
                        <input id="location" type="text" title="Event Location" className="wide-text-box single-line-text-box medium-text-box" placeholder="Location" value={this.state.eventData.location} onChange={this.locationChanged}/>
                        <textarea id="description" title="Event Description" className="wide-text-box multi-line-text-box" placeholder="Description" value={this.state.eventData.description} onChange={this.descriptionChanged}/>
                        <EventVisibilitySelector visibility={this.state.eventData.visibility} onChange={this.visibilityChanged}/>

                        <div className="form-submit-button-container">
                            <button id="submit" className="button" onClick={this.addButtonClicked}>{this.state.eventData.id ? 'Update' : 'Add'} Event</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
