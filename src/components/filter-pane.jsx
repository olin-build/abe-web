import * as React from "react";
import copy from 'copy-to-clipboard';

export default class FilterPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          labels : this.props.labels,
          labelElems: []
        };
        this.labelClicked = this.labelClicked.bind(this);
        this.submitExport = this.submitExport.bind(this);
        this.getLabels = this.getLabels.bind(this);

    }

    labelClicked(labelName) {
        this.props.labelVisibilityToggled(labelName);
    }

    componentDidMount(){
      let labels = this.getLabels((labels)=>{
        for (let i in labels){
          labels[i].visible = false
        }
        this.setState({labels: labels});
        this.props.setLabels(labels);
      })

    }

    componentWillReceiveProps(nextProps){
      let labelElems = [];
      for (let i in nextProps.labels) {
            let label = nextProps.labels[i];
            let name = label.name;
            let classes = label.visible ? 'button label selected': 'button label';
              labelElems.push(<button id={'label-'+name} key={name} type="button" className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
          }
          this.setState({labelElems : labelElems})
    }

    getLabels(callback){
      let self = this
      $.ajax({
          url: window.abe_url + '/labels/',
          method: 'GET',
          success: callback,
          error: function( jqXHR, textStatus, errorThrown ){
              alert("Error: " + errorThrown);
          }
      });
    }

    submitExport(e){
      let request = {
        activeLabels: [],
      }
      for (let label in this.props.labels){
        if (this.props.labels[label]){
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
        let labelElems = this.state.labelElems;
        return (
            <div className="row large-collapse filter-pane">
                <span className="column small-12 filter-pane-title">Filter</span>
                <div className="column small-12 filter-pane-labels-list">
                    {labelElems}
                </div>
                <button className="button submit" onClick={this.submitExport}>Export ICS</button>
            </div>
        )
    }

}
