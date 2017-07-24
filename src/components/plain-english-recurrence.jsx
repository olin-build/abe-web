function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"} //thanks to Tomas Langkaas on https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number

export default class PlainEnglishRecurrence extends React.Component {

    constructor(props) {
      super(props);
          this.state = {
            recurrence : this.props.recurrence
            start : this.props.start
          };
      this.getEvery = this.getEvery.bind(this);
      this.getOn = this.getOn.bind(this);
      this.getUntil = this.getUntil.bind(this);
      let this.frequencyFormat = {
        DAILY: 'day',
        WEEKLY: 'week',
        MONTHLY: 'month',
        YEARLY: 'year'
      }
      let this.weekdayFormat = {
        SU: 'Sunday',
        MO: 'Monday',
        TU: 'Tuesday',
        WE: 'Wednesday',
        TH: 'Thursday',
        FR: 'Friday',
        SA: 'Saturday'
      }
    }



    getEvery(){
      if (this.state.recurrence.interval==1){
        let frequency = this.state.recurrence.frequency.toString().toLowerCase();
        return frequency
      }
      else{
        let frequency = 'every '+this.state.recurrence.interval + this.frequencyFormat[this.state.recurrence.frequency]+'s';
        }
      }
    }
    getOn(){
      if (this.state.recurrence.frequency == 'DAILY' or this.state.recurrence.frequency == 'YEARLY'){
        return ''
      }
      else if (this.state.recurrence.frequency == 'WEEKLY'){
        let days = [];
        for (let day in this.state.recurrence.by_day){
          days.push(this.weekdayFormat[day])
        }
        if (days.length() > 1){
          let lastDay = days[-1]
          let firstDays = days.splice(0, -1).join(', ')
          days = firstDays + 'and' + lastDay
        }
        else{
          days = days.toString()
        }
        return('on ' + days)
      }
      else if (this.state.recurrence.frequency == 'MONTHLY'){
        if this.state.recurrence.by_day{
          let ord = Math.ceil(this.state.start.date() / 7) //thanks to Giovanni Filardo at https://stackoverflow.com/questions/21737974/moment-js-how-to-get-week-of-month-google-calendar-style
          ord = ord.toString() + nth(ord);
          return('on the '+ord+ this.weekdayFormat[this.state.recurrence.by_day[0]] + 'of the month')
        }
        else{
          let date = this.state.start.date()
          let ord = date.toString() + nth(date)
          return('on the '+ord+'day of the month')
        }
      }
    }

    getUntil(){
      if this.state.recurrence.count{
        return (this.state.recurrence.count.toString() + ' times')
      }
      else if this.state.recurrence.until{
        return ('until ' + this.state.recurrence.until.format('ddd, MMM D, YYYY'))
      }
      else{
        return 'forever'
      }
    }

    render() {
      let Every = this.getEvery;
      let On = this.getOn;
      let Until = this.getUntil;
      return (
          <div className="row large-collapse">
            <span>Repeats</span>
            <span>{Every}</span>
            <span>{On}</span>
            <span>{Until}</span>
          </div>
      )
    }
}
