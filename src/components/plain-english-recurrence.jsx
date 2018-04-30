// This component turns event recurrence data into a human-readable string and displays it

import * as React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// Source: https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function nth(n) {
  return ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th';
}

export default class PlainEnglishRecurrence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.start,
    };
    this.frequencyFormat = {
      DAILY: 'day',
      WEEKLY: 'week',
      MONTHLY: 'month',
      YEARLY: 'year',
    };
    this.weekdayFormat = {
      SU: 'Sun',
      MO: 'Mon',
      TU: 'Tue',
      WE: 'Wed',
      TH: 'Thu',
      FR: 'Fri',
      SA: 'Sat',
    };
  }

  getEvery = () => (this.props.recurrence.interval === 1
    ? `${this.props.recurrence.frequency.toString().toLowerCase()} `
    : `every ${this.props.recurrence.interval} ${this.frequencyFormat[this.props.recurrence.frequency]}s `);

  getOn = () => {
    if (this.props.recurrence.frequency === 'DAILY' || this.props.recurrence.frequency === 'YEARLY') {
      return '';
    } else if (this.props.recurrence.frequency === 'WEEKLY') {
      let days = [];
      for (const i in this.props.recurrence.by_day) {
        const day = this.props.recurrence.by_day[i];
        days.push(this.weekdayFormat[day]);
      }
      if (days.length > 1) {
        const lastDay = days.pop();
        const firstDays = days.join(', ');
        days = `${firstDays} and ${lastDay}`;
      } else {
        days = days.toString();
      }
      return `on ${days}`;
    } else if (this.props.recurrence.frequency === 'MONTHLY') {
      if (this.props.recurrence.by_day) {
        // thanks to Giovanni Filardo at
        // https://stackoverflow.com/questions/21737974/moment-js-how-to-get-week-of-month-google-calendar-style
        let ord = Math.ceil(this.state.start.date() / 7);
        ord = `${ord.toString() + nth(ord)} `;
        return (`on the ${ord}${this.weekdayFormat[this.props.recurrence.by_day[0]]} of the month`);
      }

      const date = this.state.start.date();
      const ord = `${date.toString() + nth(date)} `;
      return `on the ${ord}day of the month`;
    }
  };

  getUntil = () => {
    if (this.props.recurrence.count) {
      return (` ${this.props.recurrence.count.toString()} times`);
    } else if (this.props.recurrence.until) {
      const until = moment(this.props.recurrence.until);
      return (` until ${until.format('ddd, MMM D, YYYY')}`);
    }

    return ' forever';
  };

  render() {
    const every = this.getEvery();
    const on = this.getOn();
    const until = this.getUntil();
    return (
      <div className="large-collapse">
        <span>Repeats </span>
        {every}
        {on}
        {until}
      </div>
    );
  }
}

// Define React prop types for type checking during development
PlainEnglishRecurrence.propTypes = {
  recurrence: PropTypes.object.isRequired,
};
