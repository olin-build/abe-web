import * as React from "react";
import FilterPane from '../../components/filter-pane.jsx';

export default class CalendarScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {labels: []};

        this.doingLabelRefresh = false;

        this.getEvents = this.getEvents.bind(this);
        this.getEventsFromServer = this.getEventsFromServer.bind(this);
        this.updateFilters = this.updateFilters.bind(this);
        this.renderEvents = this.renderEvents.bind(this);
        this.renderFinished = this.renderFinished.bind(this);
        this.labelVisibilityToggled = this.labelVisibilityToggled.bind(this);
    }

    componentDidMount(){
        this.calendar = $('#calendar');
        this.calendar.fullCalendar({
            weekends: true,
            events: this.getEvents,
            aspectRatio: 2,
            eventRender: this.renderEvents,
            eventAfterAllRender: this.renderFinished,
        });

    }

    getEvents(start, end, timezone, callback) {
        // Hack to prevent a server query when toggling visibility of labels
        if (this.doingLabelRefresh) {
            this.doingLabelRefresh = false;
            callback(this.getEventsFiltered());
        } else {
            this.getEventsFromServer(start, end, timezone, callback);
        }
    }

    getEventsFromServer(start, end, timezone, callback) {
        let self = this;
        let startDate = start._d;
        let endDate = end._d;
        let startString = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
        let endString = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
        $.ajax({
            url: window.abe_url + '/events/?start=' + startString + '&end=' + endString, // TODO Handle caching
            type: 'GET',
            error: function() {
                alert('There was an error while fetching events!');
            },
            success: function (events) {
                for (let i in events){
                  start = moment(events[i].start);
                  end = moment(events[i].end);
                  events[i].start = start
                  events[i].end = end
                }
                self.setState({events: events});
                self.updateFilters(events);
                callback(self.getEventsFiltered());
            }
        })
    }

    getEventsFiltered() {
        let eventsToShow = [];
        // For each event
        for (let i = 0; i < this.state.events.length; ++i) {
            let event = this.state.events[i];
            // Check for a label that is visible
            for (let j = 0; j < event.labels.length; ++j) {
                if (this.isLabelVisible(event.labels[j])) {
                    // This event should be visible
                    eventsToShow.push(event);
                    break;
                }
            }
        }
        return eventsToShow;
    }

    isLabelVisible(label) {
        return this.state.labels[label];
    }

    labelVisibilityToggled(labelName) {
        // Update the label visibility in our state
        let labels = this.state.labels;
        let currentVisibility = this.state.labels[labelName];
        labels[labelName] = !currentVisibility;
        this.setState({labels: labels}, () => {
            // Update the calendar view
            this.doingLabelRefresh = true;
            this.calendar.fullCalendar('refetchEvents');
        });
    }

    updateFilters(events) {
        let labels = {};
        for (let i = 0; i < events.length; ++i) {
            let event = events[i];
            for (let j = 0; j < event.labels.length; ++j) {
                // if (this.state.labels.indexOf(event.labels[j]) < 0) {
                    labels[event.labels[j]] = true; // {labelName: isVisible} TODO Don't always default to visible
                // }
            }
        }
        this.setState({labels: labels});
    }

    renderEvents(event, element) {
        //add the label to masterLabels if it isn't there when we render
        let linkSuffix = (event.id) ? event.id : event.sid;
        // let content = (
        //         <div>
        //             <div className="tooltip-description">{event.description}</div>
        //             <div className="tooltip-options">
        //                 <a href={'/view/'+linkSuffix} alt="View event details" title="View event details">Details</a>
        //                 <a href={'/edit/'+linkSuffix} alt="Edit event details" title="Edit event">Edit</a>
        //             </div>
        //         </div>
        //     );
        let content = $('<div>').text(event.description);
        if (event.sid)
          content.append($('<br>'),$('<a>').attr('href','/view/'+linkSuffix).text('Details'),$('<span> | </span>'),$('<a>').attr('href','/edit/'+linkSuffix).text('Edit'),$('<span> | </span>'),$('<a>').attr('href','/edit/'+linkSuffix+'/'+event.start).text('Edit Occurence'));
        else {
          content.append($('<br>'),$('<a>').attr('href','/view/'+linkSuffix).text('Details'),$('<span> | </span>'),$('<a>').attr('href','/edit/'+linkSuffix).text('Edit'));
        }
        element.qtip({
            content: {
                title: event.title,
                text: content
            },
            style: {classes: 'qtip-light'},
            show: 'click',
            hide: {event: 'unfocus'}
        });
        //set colors differently based on the label (will change in later iterations)
        if(event.visibility === "public"){
            element.css('background-color', 'blue');
            element.css('border-color', 'blue');
        }
        else if(event.visibility === "students"){
            element.css('background-color','red');
            //event.rendering = "background"
        }
        return true; //active;
    }


    renderFinished() {
        if ('onLabelUpdate' in this.props) {
            this.props.onLabelUpdate(this.state.labels);
        }
    }

    render(){
        return (
            <div className="row page-container">
                <div className="columns large-2 large-push-10 filter-pane-container">
                    <FilterPane labels={this.state.labels} labelVisibilityToggled={this.labelVisibilityToggled}/>
                </div>
                <div id='calendar' className="columns calendar-container large-10 large-pull-2"></div>
            </div>
        );
    }

}
