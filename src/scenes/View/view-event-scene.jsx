import * as React from "react";
import moment from "moment";
import Markdown from 'react-markdown';

export default class ViewEventScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {id: ('match' in props && 'id' in props.match.params) ? props.match.params.id : null};
    }

    componentDidMount() {
        let self = this;
        if ('id' in this.state) {
            $.ajax({
                url: window.abe_url + '/events/' + self.state.id,
                method: 'GET',
                error: error => alert('Error retrieving event data from server:\n' + error),
                success: data => {
                    data.start = moment(data.start);
                    data.end = moment(data.end);
                    self.setState({eventData: data});
                }
            });
        }
    }

    render() {
        if (this.state.eventData) {
            let oneDay = this.state.eventData.start.diff(this.state.eventData.end, 'days') === 0;
            let endDateFormat = (oneDay) ? 'h:mm A' : 'ddd, MMM d, YYYY h:mm A';
            return (
                <div className="row expanded page-container">
                    <div className="row content-container">
                        <h1 className="page-title">{this.state.eventData.title}</h1>
                        <div className="event-info-container">
                            <div className="event-date-location-container">
                                <span className="event-start">{this.state.eventData.start.format('ddd, MMM d, YYYY h:mm A')}</span>
                                &nbsp; to &nbsp;
                                <span className="event-start">{this.state.eventData.end.format(endDateFormat)}</span><br/>
                                <span className="event-location">{this.state.eventData.location}</span>
                            </div>
                            <Markdown source={this.state.eventData.description} className="description-container" />
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