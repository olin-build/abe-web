import * as React from "react";
import {Redirect} from 'react-router';
import moment from "moment";
import Markdown from 'react-markdown';
import SidebarModes from "../../data/sidebar-modes";
import PlainEnglishRecurrence from '../../components/plain-english-recurrence.jsx'
import axios from 'axios';

export default class ViewEventScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {id: ('match' in props && 'id' in props.match.params) ? props.match.params.id : null,
          redirect: false
        };
    }

    componentDidMount() {
        this.props.setSidebarMode(SidebarModes.VIEW_EVENT);
        if ('id' in this.state) {
            axios.get(window.abe_url + '/events/' + this.state.id).then(response => {
                let data = response.data;
                data.start = moment.utc(data.start);
                data.start = data.start.local();
                data.end = moment.utc(data.end);
                data.end = data.end.local();
                this.props.setCurrentEvent(data);
                this.setState({eventData: data});
            }).catch(error => alert('Error retrieving event data from server:\n' + error));
        }
    }

    componentWillUnmount() {
        this.props.setCurrentEvent(null);
    }

    render() {
        if (this.state.eventData) {
            let oneDay = this.state.eventData.start.diff(this.state.eventData.end, 'days') === 0;
            let timeFormat = this.state.eventData.allDay ? '' : ' h:mm A';
            let startDateFormat = 'ddd, MMM D, YYYY' + timeFormat;
            let endDateFormat = (oneDay) ? timeFormat : ' ddd, MMM D, YYYY' + timeFormat;
            let redirect = this.state.redirect ? <Redirect to={'/edit/'+ this.state.eventData.id}/> : null;
            // let edit = this.state.eventData.UID ?  null : <button className="button cancel" onClick={()=>{this.setState({redirect: true})}}>Edit Event</button>;
            let end = this.state.eventData.allDay && oneDay ? null : <span> to<span className="event-start">{this.state.eventData.end.format(endDateFormat)}</span></span>;
            let recurrence = this.state.eventData.recurrence ? <PlainEnglishRecurrence recurrence={this.state.eventData.recurrence} start={this.state.eventData.start}/> : null;
            return (
                <div className="row expanded page-container">
                    <div className="row content-container">
                        <h1 className="page-title">{this.state.eventData.title}</h1>
                        {redirect}
                        <div className="event-info-container">
                            <div className="event-date-location-container">
                                <span className="event-start">{this.state.eventData.start.format(startDateFormat)}</span>
                                {end}
                                {recurrence}
                                <p className="event-location">{this.state.eventData.location}</p>
                            </div>
                            <Markdown source={this.state.eventData.description} className="description-container" />
                          {/*{edit}*/}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="row expanded page-container">
                    <div className="row content-container">
                        <h1 className="page-title">Loading...</h1>
                    </div>
                </div>
            )
        }
    }

}
