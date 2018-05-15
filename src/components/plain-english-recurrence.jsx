// This component turns event recurrence data into a human-readable string and displays it

import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';

// eslint-disable-next-line max-len
// Source: https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
export function nth(n) {
  const mod = n % 100;
  return ((mod < 10 || mod >= 20) && [null, 'st', 'nd', 'rd'][n % 10]) || 'th';
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

  getEvery = () =>
    (this.props.recurrence.interval === 1
      ? `${this.props.recurrence.frequency.toString().toLowerCase()} `
      : `every ${this.props.recurrence.interval} ${
        this.frequencyFormat[this.props.recurrence.frequency]
      }s `);

  getOn = () => {
    switch (this.props.recurrence.frequency) {
      case 'WEEKLY': {
        const { weekdayFormat } = this;
        let days = this.props.recurrence.by_day.map(day => weekdayFormat[day]);
        if (days.length > 1) {
          const lastDay = days.pop();
          const firstDays = days.join(', ');
          days = `${firstDays} and ${lastDay}`;
        } else {
          days = days.toString();
        }
        return `on ${days}`;
      }

      case 'MONTHLY': {
        if (this.props.recurrence.by_day) {
          // thanks to Giovanni Filardo at
          // eslint-disable-next-line max-len
          // https://stackoverflow.com/questions/21737974/moment-js-how-to-get-week-of-month-google-calendar-style
          let ord = Math.ceil(this.state.start.date() / 7);
          ord = `${ord.toString() + nth(ord)} `;
          return `on the ${ord}${this.weekdayFormat[this.props.recurrence.by_day[0]]} of the month`;
        }

        const date = this.state.start.date();
        const ord = `${date.toString() + nth(date)} `;
        return `on the ${ord}day of the month`;
      }

      default:
        return '';
    }
  };

  getUntil = () => {
    if (this.props.recurrence.count) {
      return ` ${this.props.recurrence.count.toString()} times`;
    } else if (this.props.recurrence.until) {
      const until = moment(this.props.recurrence.until);
      return ` until ${until.format('ddd, MMM D, YYYY')}`;
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
  recurrence: PropTypes.shape({
    by_day: PropTypes.arrayOf(PropTypes.oneOf(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'])),
    count: PropTypes.number,
    interval: PropTypes.number.isRequired,
    frequency: PropTypes.oneOf(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).isRequired,
    until: PropTypes.object,
  }).isRequired,
};
