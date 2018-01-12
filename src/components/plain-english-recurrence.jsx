// This component turns event recurrence data into a human-readable string and displays it

import * as React from "react";
import moment from "moment";
import PropTypes from 'prop-types';

function nth(n) {
    return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"
} //thanks to Tomas Langkaas on https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number

export default class PlainEnglishRecurrence extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            start: this.props.start
        };
        this.frequencyFormat = {
            DAILY: 'day',
            WEEKLY: 'week',
            MONTHLY: 'month',
            YEARLY: 'year'
        };
        this.weekdayFormat = {
            SU: 'Sun',
            MO: 'Mon',
            TU: 'Tue',
            WE: 'Wed',
            TH: 'Thu',
            FR: 'Fri',
            SA: 'Sat'
        };
    }
    
    getEvery = () => this.props.recurrence.interval === 1
            ? this.props.recurrence.frequency.toString().toLowerCase() + ' '
            : 'every ' + this.props.recurrence.interval + ' ' + this.frequencyFormat[this.props.recurrence.frequency] + 's ';
    
    getOn = () => {
        if (this.props.recurrence.frequency === 'DAILY' || this.props.recurrence.frequency === 'YEARLY') {
            return ''
        }
        else if (this.props.recurrence.frequency === 'WEEKLY') {
            let days = [];
            for (let i in this.props.recurrence.by_day) {
                let day = this.props.recurrence.by_day[i];
                days.push(this.weekdayFormat[day])
            }
            if (days.length > 1) {
                let lastDay = days.pop();
                let firstDays = days.join(', ');
                days = firstDays + ' and ' + lastDay;
            }
            else {
                days = days.toString();
            }
            return 'on ' + days;
        }
        else if (this.props.recurrence.frequency === 'MONTHLY') {
            if (this.props.recurrence.by_day) {
                let ord = Math.ceil(this.state.start.date() / 7); //thanks to Giovanni Filardo at https://stackoverflow.com/questions/21737974/moment-js-how-to-get-week-of-month-google-calendar-style
                ord = ord.toString() + nth(ord) + ' ';
                return ('on the ' + ord + this.weekdayFormat[this.props.recurrence.by_day[0]] + ' of the month');
            }
            else {
                let date = this.state.start.date();
                let ord = date.toString() + nth(date) + ' ';
                return 'on the ' + ord + 'day of the month';
            }
        }
    };

    getUntil = () => {
        if (this.props.recurrence.count) {
            return (' ' + this.props.recurrence.count.toString() + ' times');
        }
        else if (this.props.recurrence.until) {
            let until = moment(this.props.recurrence.until);
            return (' until ' + until.format('ddd, MMM D, YYYY'));
        }
        else {
            return ' forever';
        }
    };

    render() {
        let every = this.getEvery();
        let on = this.getOn();
        let until = this.getUntil();
        return (
            <div className="large-collapse">
                <span>Repeats </span>
                {every}
                {on}
                {until}
            </div>
        )
    }
}

// Define React prop types for type checking during development
PlainEnglishRecurrence.propTypes = {
    recurrence: PropTypes.object.isRequired,
};
