import * as React from "react";
import SidebarModes from "../../data/sidebar-modes";
import * as fullCalendar from 'fullcalendar/dist/fullcalendar';
import * as qtip from '../../../public/js/vendor/jquery.qtip.js'

export default class CalendarScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            events: [],
            colorSettings: ''
        };
        this.doingLabelRefresh = false;
    }

    componentDidMount(){
        this.props.setSidebarMode(SidebarModes.CALENDAR_VIEW);

        this.calendar = $('#calendar');
        this.calendar.fullCalendar({
            weekends: true,
            events: this.getEvents,
            aspectRatio: 2,
            eventRender: this.renderEvents,
            header: {
               left:   'title',
               center: 'month, agendaWeek, agendaDay',
               right:  'today prev,next'
           }
        });
    }

    componentDidUpdate() {
        this.refreshViewFromCache();
    }

    getEvents = (start, end, timezone, callback) => {
        // Hack to prevent a server query when toggling visibility of labels
        if (this.doingLabelRefresh) {
            this.doingLabelRefresh = false;
            callback(this.getEventsFiltered());
        } else {
            this.getEventsFromServer(start, end, timezone, callback);
        }
    };

    getEventsFromServer = (start, end, timezone, callback) => {
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
                  start = moment.utc(events[i].start);
                  start = start.local()
                  end = moment.utc(events[i].end);
                  end = end.local()
                  events[i].start = start
                  events[i].end = end
                }
                self.setState({events: events}, ()=> {
                    let events = self.getEventsFiltered();
                    callback(events);
                });
              }
            })
    };

    getEventsFiltered = () => {
        console.debug('getEventsFiltered called... Number of events: ' + this.state.events.length + ', number of labels: ' + Object.keys(this.props.labels).length);
        let eventsToShow = [];
        // For each event
        for (let i = 0; i < this.state.events.length; ++i) {
            let event = this.state.events[i];
            // Check for a label that is visible
            for (let j = 0; j < event.labels.length; ++j) {
                if (this.isLabelVisible(event.labels[j])) {
                    // This event should be visible
                    event.color = this.props.labels[event.labels[j]].color
                    eventsToShow.push(event);
                    break;
                }
            }
        }
        console.debug('Returning ' + eventsToShow.length + ' events to FullCalendar');;
        return eventsToShow;
    };

    refreshViewFromCache = () => {
        this.doingLabelRefresh = true;
        this.calendar.fullCalendar('refetchEvents');
    };

    isLabelVisible = (label) => {
        try {
            return this.props.labels[label].default === "True" || this.props.labels[label].default === true;
        } catch (e) {
            return false;
        }
    };

    labelVisibilityToggled = (labelName) => {
        // Update the label visibility in our state
        let labels = this.props.labels;
        let currentVisibility = this.props.labels[labelName].default;
        labels[labelName].default = !currentVisibility;
        this.setState({labels: labels}, () => {
            // Update the calendar view
            this.doingLabelRefresh = true;
            this.calendar.fullCalendar('refetchEvents');
        });
    };

    eventEditClicked = (event) => {
        let linkSuffix = event.target.getAttribute('linkSuffix');
        this.props.editEvent(linkSuffix);
        event.preventDefault();
    };

    eventViewClicked = (event) => {
        let linkSuffix = event.target.getAttribute('linkSuffix');
        this.props.viewEvent(linkSuffix);
        event.preventDefault();
    };

    renderEvents = (event, element) => {
        //add the label to masterLabels if it isn't there when we render
        let linkSuffix = (event.id) ? event.id : event.sid;
        let content = $('<div>').text(event.description);
        content.append($('<br>'));
        let rec_id = event.start.utc().valueOf()
        if (event.UID){
          content.append($('<a>').attr('linkSuffix', linkSuffix).on('click',this.eventViewClicked).text('Details'))
        }
        else if (event.sid)
          content.append($('<a>').attr('linkSuffix', linkSuffix).on('click',this.eventViewClicked).text('Details'),$('<span> | </span>'),$('<a>').attr('linkSuffix', linkSuffix).on('click',this.eventEditClicked).text('Edit'),$('<span> | </span>'),$('<a>').attr('linkSuffix', linkSuffix+'/'+rec_id).on('click',this.eventViewClicked).text('Edit Occurrence'));
        else {
          content.append($('<a>').attr('linkSuffix', linkSuffix).on('click',this.eventViewClicked).text('Details'),$('<span> | </span>'),$('<a>').attr('linkSuffix', linkSuffix).on('click',this.eventEditClicked).text('Edit'));
        }
        element.qtip({
            content: {
                title: event.title,
                text: content
            },
            style: {classes: 'qtip-light'},
            show: 'click',
            hide: {event: 'unfocus click'},
            position: {
              my: 'top left',
              at: 'bottom left'
            }
        });
        //set colors differently based on the label (will change in later iterations)
        element.css('background-color', event.color);
        element.css('border-color', event.color);
        return true; //active;
    };

    render(){
        return (
            <div className="wrapper">
                <div className="calendar-container">
                    <div style={{display: 'none'}}>{Object.values(this.props.labels).map(label => label.name)}</div>
                    <div id='calendar' className="page-container calendar-container"></div>
                </div>
            </div>
        );
    }

}
