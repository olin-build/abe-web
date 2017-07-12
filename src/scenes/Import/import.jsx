import * as React from "react";
import {browserHistory} from 'react-router-dom';
import TagEntry from '../../components/tag-entry.jsx';

export default class ImportScene extends React.Component {
  constructor(props) {
      super(props);
      this.labelsChanged = this.labelsChanged.bind(this);
      this.urlChanged = this.urlChanged.bind(this);
      this.submitICS = this.submitICS.bind(this);
      this.state = {
        labels : [],
        url : '',
      }
      this.possibleLabels = ['Library', 'OFAC', 'FWOP', 'OARS', 'Robolab', 'StAR', 'PGP', 'Admission', "Candidates' Weekend"]
    }
  labelsChanged(labels) {
      if (this.state) {
          let state = this.state;
          state.labels = labels;
          this.setState(state);
      }
  }
  urlChanged(e) {
      let state = this.state;
      state = Object.assign(state, {url: e.currentTarget.value});
      this.setState(state);
  }
  submitICS(){
    $.ajax({
        url: window.abe_url + '/ics/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(this.state),
        success: response => alert('ICS imported'),
        error: function( jqXHR, textStatus, errorThrown ){
            alert("Error: " + errorThrown)},
    })
  }
  render(){
    return(
      <div className="row expanded page-container">
          <div className="row content-container">
              <h1 className="page-title">Import</h1>
              <input required="required" type="url" placeholder=".../example_calendar.ics" className="wide-text-box single-line-text-box medium-text-box" onChange={this.urlChanged}/>
              <TagEntry tags={this.state.labels} onChange={this.labelsChanged} possibleLabels={this.possibleLabels}/>
              <br/>
              <input type="submit" className="button submit" value="Submit" onClick={this.submitICS}/>
          </div>
      </div>
    )
  }
}
