import * as React from "react";

export default class EventDateTimeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.monthChanged = this.monthChanged.bind(this);
        this.dayChanged = this.dayChanged.bind(this);
        this.yearChanged = this.yearChanged.bind(this);
        this.hourChanged = this.hourChanged.bind(this);
        this.minuteChanged = this.minuteChanged.bind(this);
        this.state = {
          date: this.props.datetime,
          month: this.props.datetime.getMonth(),
          day: this.props.datetime.getDate(),
          year: this.props.datetime.getFullYear(),
          hour: this.props.datetime.getHours(),
          minute: this.props.datetime.getMinutes(),
        };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        date: nextProps.datetime,
        month: nextProps.datetime.getMonth(),
        day: nextProps.datetime.getDate(),
        year: nextProps.datetime.getFullYear(),
        hour: nextProps.datetime.getHours(),
        minute: nextProps.datetime.getMinutes(),
      });
    }

    monthChanged(e) {
      var newMonth;
      newMonth = e.currentTarget.value;
      let newDate = this.state.date;
      newDate.setMonth(newMonth);
      this.setState({date: newDate});
      this.setState({month: newMonth});
      this.props.onChange(this.state.date)

    }
    dayChanged(e) {
      var newDay;
      newDay = e.currentTarget.value;
      let newDate = this.state.date;
      newDate.setDate(newDay);
      this.setState({date: newDate});
      this.setState({day: newDay});
      this.props.onChange(this.state.date)
    }
    yearChanged(e) {
      var newYear;
      newYear = e.currentTarget.value;
      let newDate = this.state.date;
      newDate.setFullYear(newYear);
      this.setState({date: newDate});
      this.setState({year: newYear});
      this.props.onChange(this.state.date)
    }
    hourChanged(e) {
      var newHour;
      newHour = e.currentTarget.value;
      let newDate = this.state.date;
      newDate.setHours(newHour);
      this.setState({date: newDate});
      this.setState({hour: newHour});
      this.props.onChange(this.state.date)
    }
    minuteChanged(e) {
      var newMinute;
      newMinute = e.currentTarget.value;
      let newDate = this.state.date;
      newDate.setMinutes(newMinute);
      this.setState({date: newDate});
      this.setState({minute: newMinute});
      this.props.onChange(this.state.date)
    }

    render() {
        return (
            <div className="date-time-container">
              <input title="Month" type='number' min="11" max="0" className="single-line-text-box super-short-text-box" placeholder="Month" value={this.state.month} onChange={this.monthChanged}/>
              <input title="Day" type='number' min="1" max="31" className="single-line-text-box super-short-text-box" placeholder="Day" value={this.state.day} onChange={this.dayChanged}/>
              <input title="Year" type='number' className="single-line-text-box super-short-text-box" placeholder="Year" value={this.state.year} onChange={this.yearChanged}/>
              <input title="Hour" type='number' min="0" max="23" className="single-line-text-box super-short-text-box" placeholder="Hour" value={this.state.hour} onChange={this.hourChanged}/>
              <input title="Minute" type='number' min="0" max="59" className="single-line-text-box super-short-text-box" placeholder="Minute" value={this.state.minute} onChange={this.minuteChanged}/>
            </div>
        )
    }
}
