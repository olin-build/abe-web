import * as React from "react";
import copy from 'copy-to-clipboard';

export default class FilterPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          labelElems: []
        };
        this.labelClicked = this.labelClicked.bind(this);
        this.submitExport = this.submitExport.bind(this);
        this.processLabels = this.processLabels.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectNone = this.selectNone.bind(this);
    }

    labelClicked(labelName) {
        this.props.labelVisibilityToggled(labelName);
    }

    componentDidMount(){
        this.props.refreshLabels();
    }

    componentWillReceiveProps(nextProps){
        this.processLabels(nextProps.labels);
    }

    processLabels(labels) {
        let labelElems = [];
        Object.keys(labels).forEach( (name) => {
            let classes = labels[name].default ? 'button label selected '+ name: 'button label ' + name;
            labelElems.push(<button id={'label-'+name} key={name} type="button" className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
        });
        this.setState({labelElems : labelElems})
    }

    selectAll(){
      let labels = this.props.labels;
      for (let label in labels){
        if (labels[label].default == false){
          this.props.labelVisibilityToggled(labels[label].name)
        }
      }
    }

    selectNone(){
      let labels = this.props.labels;
      for (let label in labels){
        if (labels[label].default == true){
          this.props.labelVisibilityToggled(labels[label].name)
        }
      }
    }

    submitExport(e){
      let request = {
        activeLabels: [],
      }
      for (let label in this.props.labels){
        if (this.props.labels[label].default){
          request.activeLabels.push(label)
        }
      }
      request.activeLabels=request.activeLabels.toString()
      let url = window.abe_url + '/ics/?labels=' + request.activeLabels
      copy(url);
      $.ajax({
          url: url,
          method: 'GET',
          success: function(){
            alert('This link was automatically copied to your clipboard: \n \n'+url + '\n \nPut it in your calendar application to subscribe to a custom feed.');
            },
          error: function( jqXHR, textStatus, errorThrown ){
              alert("Error: " + errorThrown);
          }
      });
    }

    render() {
        let colorSettings = '';
        for (let key in this.props.labels) {
            colorSettings += '.button.' + key + ':not(.selected){background-color: darkgray;}.'+key+',.button.' + key + ':hover,.button.'+key+'.selected{background-color:' + this.props.labels[key].color + ';}'
        }
        return (
            <div className="sidebar-item filter-pane">
                <style type="text/css">{colorSettings}</style>
                <div className="filter-pane-title sidebar-title">
                    <span className="sidebar-title-left">Filter</span>
                    <span className="sidebar-title-right"><a onClick={this.selectAll}>All</a> | <a onClick={this.selectNone}>None</a></span>
                </div>
                <div className="sidebar-item-content">
                    <div className="filter-pane-labels-list">
                        {this.state.labelElems}
                    </div>
                    <button className="button submit" onClick={this.submitExport}>Export ICS</button>
                    <input type="checkbox" checked={this.state.checked} />
                </div>
            </div>
        )
    }

}
