// This component is used to set event recurrence info

import * as React from 'react';
import moment from 'moment';
import EventDateTimeSelector from '../../components/date-time-selector';
import PlainEnglishRecurrence from '../../components/plain-english-recurrence';

class MonthOptions extends React.Component {
  radioCheckedHandler = e => this.props.onChange(e.currentTarget.value);

  render() {
    return (
      <div className="radio-collection-container">
        <span className="radio-collection-title">on</span>
        <div className="radio-collection-options-container">
          <div className="radio-option">
            <input
              type="radio"
              id="month-options-month"
              name="month-options"
              value="month"
              title="day of the month"
              checked={this.props.option === 'month'}
              onChange={this.radioCheckedHandler}
            />
            <label htmlFor="month-options-month">day of the month</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="month-options-week"
              name="month-options"
              value="week"
              title="day of the week"
              checked={this.props.option === 'week'}
              onChange={this.radioCheckedHandler}
            />
            <label htmlFor="month-options-week">day of the week</label>
          </div>
        </div>
      </div>
    );
  }
}

class WeekOptions extends React.Component {
  constructor(props) {
    super(props);
    this.checkedHandler = this.checkedHandler.bind(this);
    this.state = {
      days: this.props.days,
    };
  }

  checkedHandler(e) {
    const newDays = this.state.days;
    const index = newDays.indexOf(e.currentTarget.value);
    if (index > -1) {
      newDays.splice(index, 1);
    } else {
      newDays.push(e.currentTarget.value);
    }
    this.setState({ days: newDays }, () => {
      this.props.onChange(this.state);
    });
    this.props.onChange(e.currentTarget.value);
  }

  render() {
    return (
      <div className="radio-collection-container">
        <span className="radio-collection-title">on</span>
        <div className="radio-collection-options-container">
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-SU"
              name="week-options"
              value="SU"
              title="Sun"
              checked={this.props.days.indexOf('SU') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-SU">Sun</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-MO"
              name="week-options"
              value="MO"
              title="Mon"
              checked={this.props.days.indexOf('MO') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-MO">Mon</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-TU"
              name="week-options"
              value="TU"
              title="Tue"
              checked={this.props.days.indexOf('TU') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-TU">Tue</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-WE"
              name="week-options"
              value="WE"
              title="Wed"
              checked={this.props.days.indexOf('WE') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-WE">Wed</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-TH"
              name="week-options"
              value="TH"
              title="Thu"
              checked={this.props.days.indexOf('TH') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-TH">Thu</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-FR"
              name="week-options"
              value="FR"
              title="Fri"
              checked={this.props.days.indexOf('FR') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-FR">Fri</label>
          </div>
          <div className="radio-option">
            <input
              type="checkbox"
              id="week-options-SA"
              name="week-options"
              value="SA"
              title="Sat"
              checked={this.props.days.indexOf('SA') > -1}
              onChange={this.checkedHandler}
            />
            <label htmlFor="week-options-SA">Sat</label>
          </div>
        </div>
      </div>
    );
  }
}

class EndOptions extends React.Component {
  constructor(props) {
    super(props);
    this.radioCheckedHandler = this.radioCheckedHandler.bind(this);
    this.endDateHandler = this.endDateHandler.bind(this);
    this.occurenceChangedHandler = this.occurenceChangedHandler.bind(this);
    this.state = {
      option: this.props.option,
      endDate: moment(),
      occurence: String(2),
    };
  }

  componentDidMount() {
    this.state.endDate.milliseconds(0);
  }

  radioCheckedHandler(e) {
    this.setState({ option: e.currentTarget.value }, () => {
      this.props.onChange(this.state);
    });
  }

  endDateHandler(value) {
    this.setState({ endDate: value }, () => {
      this.props.onChange(this.state);
    });
  }

  occurenceChangedHandler(e) {
    this.setState({ occurence: String(e.currentTarget.value) }, () => {
      this.props.onChange(this.state);
    });
  }


  render() {
    const untilDate = this.state.option === 'date' ?
      <EventDateTimeSelector datetime={this.state.endDate} onChange={this.endDateHandler} show="date" /> : null;
    return (
      <div className="radio-collection-container">
        <span className="radio-collection-title">ends</span>
        <div className="radio-collection-options-container">
          <div className="radio-option">
            <input
              type="radio"
              id="end-options-date"
              name="end-options"
              value="date"
              title="date"
              checked={this.props.option === 'date'}
              onChange={this.radioCheckedHandler}
            />
            <label htmlFor="end-options-date">date</label>
          </div>
          {untilDate}
          <div className="radio-option">
            <input
              type="radio"
              id="end-options-occurences"
              name="end-options"
              value="occurences"
              title="occurences"
              checked={this.props.option === 'occurences'}
              onChange={this.radioCheckedHandler}
            />
            <label htmlFor="end-options-occurences">
              <input
                title="Occurence Number"
                type="number"
                min="1"
                className="single-line-text-box super-short-text-box"
                placeholder="#"
                value={this.state.occurence}
                onChange={this.occurenceChangedHandler}
              />
              <span> times</span>
            </label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="end-options-forever"
              name="end-options"
              value="forever"
              title="forever"
              checked={this.props.option === 'forever'}
              onChange={this.radioCheckedHandler}
            />
            <label htmlFor="end-options-forever">forever</label>
          </div>
        </div>

      </div>
    );
  }
}

export default class RecurrenceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.frequencyChanged = this.frequencyChanged.bind(this);
    this.intervalChanged = this.intervalChanged.bind(this);
    this.monthOptionsChanged = this.monthOptionsChanged.bind(this);
    this.endOptionsChanged = this.endOptionsChanged.bind(this);
    this.state = {
      recurrence: this.props.reccurs,
      start: this.props.start,
    };
  }

  frequencyChanged(e) {
    let reccurs = this.state.recurrence;
    if (e.currentTarget.value === 'WEEKLY' && reccurs.by_month_day) {
      // reccurs = Object.assign(reccurs, {by_month_day: undefined})
      reccurs.by_day = [this.state.start.format('dd').toUpperCase()];
      delete reccurs.by_month_day;
    }
    reccurs = Object.assign(reccurs, { frequency: e.currentTarget.value });
    this.setState({ recurrence: reccurs }, () => {
      this.props.onChange(this.state);
    });
  }

  intervalChanged(e) {
    let reccurs = this.state.recurrence;
    reccurs = Object.assign(reccurs, { interval: e.currentTarget.value });
    this.setState({ recurrence: reccurs });
    this.props.onChange(this.state);
  }

  monthOptionsChanged(value) {
    const state = this.state;
    if (value === 'month') { // By day of month
      state.recurrence.by_month_day = state.start.date().toString();
      delete state.recurrence.by_day;
    } else if (value === 'week') { // By day of week
      state.recurrence.by_day = [state.start.format('dd').toUpperCase()];
      delete state.recurrence.by_month_day;
    }
    state.recurrence.month_option = value;
    this.setState(state, () => {
      this.props.onChange(this.state);
    });
  }

  endOptionsChanged(value) {
    const state = this.state;
    if (value.option === 'date') {
      state.recurrence.until = value.endDate;
      delete state.recurrence.count;
    } else if (value.option === 'occurences') {
      state.recurrence.count = value.occurence;
      delete state.recurrence.until;
    } else {
      delete state.recurrence.count;
      delete state.recurrence.until;
    }
    state.recurrence.end_option = value.option;
    this.setState(state, () => {
      this.props.onChange(this.state);
    });
  }

  render() {
    const month_options = this.props.reccurs.frequency === 'MONTHLY' ?
      <MonthOptions option={this.state.recurrence.month_option} onChange={this.monthOptionsChanged} /> : null;
    const week_options = this.props.reccurs.frequency === 'WEEKLY' ?
      <WeekOptions days={this.state.recurrence.by_day} onChange={this.monthOptionsChanged} /> : null;
    return (
      <div className="recurrence-container">
        <div className="radio-collection-container">
          <span className="radio-collection-title">Repeat</span>
          <div className="radio-collection-options-container">

            <div className="radio-option">
              <input
                type="radio"
                id="frequency-weekly"
                name="frequency"
                value="WEEKLY"
                title="Weekly"
                checked={this.props.reccurs.frequency === 'WEEKLY'}
                onChange={this.frequencyChanged}
              />
              <label htmlFor="frequency-weekly">Weekly</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="frequency-monthly"
                name="frequency"
                value="MONTHLY"
                title="Monthly"
                checked={this.props.reccurs.frequency === 'MONTHLY'}
                onChange={this.frequencyChanged}
              />
              <label htmlFor="frequency-monthly">Monthly</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="frequency-yearly"
                name="frequency"
                value="YEARLY"
                title="Yearly"
                checked={this.props.reccurs.frequency === 'YEARLY'}
                onChange={this.frequencyChanged}
              />
              <label htmlFor="frequency-yearly">Yearly</label>
            </div>
          </div>
        </div>
        <span className="radio-collection-title">every</span>
        <input
          title="Interval"
          type="number"
          min="1"
          className="single-line-text-box super-short-text-box"
          placeholder="#"
          value={this.props.reccurs.interval}
          onChange={this.intervalChanged}
        />
        {month_options}
        {week_options}
        <EndOptions option={this.state.recurrence.end_option} onChange={this.endOptionsChanged} />
        <PlainEnglishRecurrence recurrence={this.state.recurrence} start={this.state.start} />
      </div>
    );
  }
}
