import * as React from "react";
import copy from 'copy-to-clipboard';

export default class FilterPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          labelElems: []
        };
        this.labelClicked = this.labelClicked.bind(this);
        this.processLabels = this.processLabels.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectNone = this.selectNone.bind(this);
    }

    labelClicked(labelName) {
        this.props.labelVisibilityToggled(labelName);
    }

    componentDidMount(){
      if (this.props.refreshLabels)
        {this.props.refreshLabels();}
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


    render() {
        let colorSettings = '';
        for (let key in this.props.labels) {
            colorSettings += '.button.' +key+',.button.' + key + ':hover,.button.'+key+'.selected{background-color:' + this.props.labels[key].color + ';}'
        }
        let header = null;
        if (this.props.header){
          let allNone = this.props.header.allNone ? <span className={this.props.header.allNone.class}><a onClick={this.selectAll}>All</a> | <a onClick={this.selectNone}>None</a></span> : null;
          header = <div className={this.props.header.class}>
                      {this.props.header.content}
                      {allNone}
                    </div>
        }
        return (
            <div>
                <style type="text/css">{colorSettings}</style>
                {header}
                <div className={this.props.contentClass}>
                    <div className="filter-pane-labels-list">
                        {this.state.labelElems}
                    </div>
                    <input type="checkbox" checked={this.state.checked} />
                </div>
            </div>
        )
    }

}
