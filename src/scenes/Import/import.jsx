import * as React from "react";
import SidebarModes from "../../data/sidebar-modes";
import TagPane from "../../components/tag-pane.jsx";

export default class ImportScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            importData: {
                labels : [],
                url : '',
            },
            possibleLabels : this.setLabels(props.labels.labelList),
        };
        props.refreshLabelsIfNeeded();
    }

    componentWillReceiveProps(nextProps) {
        let labels = this.setLabels(nextProps.labels.labelList);
        this.setState({possibleLabels: labels});
    }

    componentDidMount() {
        this.props.setSidebarMode(SidebarModes.IMPORT);
    }

    setLabels = (labels) => {
        let possibleLabels = {};
        if (labels) {
            for (let labelName in labels) {
                let label = labels[labelName];
                label.default = false;
                possibleLabels[labelName] = label
            }
        }
        return possibleLabels
    };

    labelsChanged = (label) => {
        if (this.state) {
            let state = this.state;
            state.possibleLabels[label].default = !state.possibleLabels[label].default
            let i = state.importData.labels.indexOf(label)
            if (i > -1){
              state.importData.labels.splice(i, 1)
            }
            else{
              state.importData.labels.push(label)
            }
            this.setState(state);
        }
      };

      urlChanged = (e) => {
          let importData = this.state.importData;
          importData = Object.assign(importData, {url: e.currentTarget.value});
          this.setState({importData : importData});
      };

      submitICS = () => {
        $.ajax({
            url: window.abe_url + '/ics/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(this.state.importData),
            success: response => alert('ICS imported'),
            error: function( jqXHR, textStatus, errorThrown ){
                alert("Error: " + errorThrown)},
        })
      };

      render(){
        return(
          <div className="row expanded page-container">
              <div className="row content-container">
                  <h1 className="page-title">Import</h1>
                  <input required="required" type="url" placeholder=".../example_calendar.ics" className="wide-text-box single-line-text-box medium-text-box" onChange={this.urlChanged}/>
                  <TagPane contentClass='import-filters' {...this.props} labelVisibilityToggled={this.labelsChanged} labels={this.state.possibleLabels}/>
                  <br/>
                  <input type="submit" className="button submit" value="Submit" onClick={this.submitICS}/>
              </div>
          </div>
        )
      }
}
