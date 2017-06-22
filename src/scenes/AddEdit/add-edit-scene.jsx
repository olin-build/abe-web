import * as React from "react";
import EventVisibilitySelector from './visibility-selector.jsx';

export default class AddEditEventScene extends React.Component {

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
        let url;
        if (window.location.href.indexOf("olinlibrary.github.io") > -1) {
            url = 'https://abeweb.herokuapp.com/calendarUpdate';
        } else {
            url = 'http://localhost:4000/calendarUpdate';
        }
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'text',
            contentType: 'text/plain', //'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function( data ){
                alert("Event saved!");
            },
            error: function( jqXHR, textStatus, errorThrown ){
                alert("Error: " + errorThrown);
            }
        });

    }

    render() {
        let title = (this.props.location.pathname === '/edit') ?  'Add Event' : 'Edit Event';
        return (
            <div className="row expanded page-container">
                <div className="row content-container">
                    <h1 className="page-title">{title}</h1>

                    <div className="event-info-container">
                        <input id="event-title" type="text" placeholder="Title" className="wide-text-box single-line-text-box medium-text-box"/>
                        <div className="date-time-container">
                            <input id="start-date" title="Start Date" type="date" className="single-line-text-box short-text-box" placeholder="Start Date"/>
                            <input id="start-time" title="Start Time" type="time" className="single-line-text-box short-text-box" placeholder="Start Time"/>
                            to
                            <input id="end-date" title="End Date" type="date" className="single-line-text-box short-text-box" placeholder="End Date"/>
                            <input id="end-time" title="End Time" type="time" className="single-line-text-box short-text-box" placeholder="End Time"/>
                        </div>
                        <input id="location" type="text" title="Event Location" className="wide-text-box single-line-text-box medium-text-box" placeholder="Location"/>
                        <textarea id="description" title="Event Description" className="wide-text-box multi-line-text-box" placeholder="Description"/>
                        <EventVisibilitySelector/>

                        <div className="form-submit-button-container">
                            <button id="submit" className="button" onClick={this.addButtonClicked}>Add Event</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
