import * as React from "react";
import {browserHistory, Redirect} from 'react-router';
import moment from "moment";
import Markdown from 'react-markdown';
import SidebarModes from "../../data/sidebar-modes";

export default class ViewEventScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {id: ('match' in props && 'id' in props.match.params) ? props.match.params.id : null,
          redirect: false
        };
    }

    componentDidMount() {
        this.props.setSidebarMode(SidebarModes.VIEW_EVENT);
        let self = this;
        if ('id' in this.state) {
            $.ajax({
                url: window.abe_url + '/events/' + self.state.id,
                method: 'GET',
                error: error => alert('Error retrieving event data from server:\n' + error),
                success: data => {
                    data.start = moment.utc(data.start);
                    data.start = data.start.local();
                    data.end = moment.utc(data.end);
                    data.end = data.end.local();
                    self.setState({eventData: data});
                }
            });
        }
    }

    render() {
        if (this.state.eventData) {
            let oneDay = this.state.eventData.start.diff(this.state.eventData.end, 'days') === 0;
            let endDateFormat = (oneDay) ? 'h:mm A' : 'ddd, MMM D, YYYY h:mm A';
            let redirect = this.state.redirect ? <Redirect to={'/edit/'+ this.state.eventData.id}/> : null;
            let edit = this.state.eventData.UID ?  null : <button className="button cancel" onClick={()=>{this.setState({redirect: true})}}>Edit Event</button>;
            return (
                <div className="row expanded page-container">
                    <div className="row content-container">
                        <h1 className="page-title">{this.state.eventData.title}</h1>
                        {redirect}
                        <div className="event-info-container">
                            <div className="event-date-location-container">
                                <span className="event-start">{this.state.eventData.start.format('ddd, MMM D, YYYY h:mm A')}</span>
                                &nbsp; to &nbsp;
                                <span className="event-start">{this.state.eventData.end.format(endDateFormat)}</span><br/>
                                <span className="event-location">{this.state.eventData.location}</span>
                            </div>
                            <Markdown source={this.state.eventData.description} className="description-container" />
                          {edit}
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
