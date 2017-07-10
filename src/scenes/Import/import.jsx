import * as React from "react";
import {browserHistory} from 'react-router-dom';

import TagEntry from '../../components/tag-entry.jsx';

export default class ImportScene extends React.Component {
  constructor(props) {
      super(props);
      this.labelsChanged = this.labelsChanged.bind(this)
      this.state = {
        labels : [],
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
  render(){
    return(
      <div className="row expanded page-container">
          <div className="row content-container">
              <h1 className="page-title">Import</h1>
              <TagEntry tags={this.state.labels} onChange={this.labelsChanged} possibleLabels={this.possibleLabels}/>
          </div>
      </div>
    )
  }
}
