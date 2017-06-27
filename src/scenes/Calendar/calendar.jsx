import * as React from "react";
import customCalendar from '../../calendar.js';

export default class CalendarScene extends React.Component {


    componentDidMount(){
        var mycalendar; //THIS IS IMPORTANT because JS sucks at handling classes
        mycalendar = new customCalendar();
        mycalendar.initCalendar();
        mycalendar.makeDropdown();
        mycalendar.populateDropdown();
        mycalendar.refreshFilters([]);
    }
    render(){
        return (
            <div className="row expanded page-container">
                <div id='calendar' className="row calendar-container"></div>
            </div>

        );
    }

}