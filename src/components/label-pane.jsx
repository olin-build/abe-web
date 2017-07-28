import * as React from "react";

export default class LabelPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          labelElems: this.processLabels(props.labels)
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
        let labelElems = this.processLabels(nextProps.labels);
        this.setState({labelElems : labelElems})
    }

    processLabels(labels) {
        let labelElems = [];
        Object.keys(labels).forEach( (name) => {
            let classes = labels[name].default ? 'button label selected '+ name: 'button label ' + name;
            labelElems.push(<button id={'label-'+name} key={name} title={labels[name].description} type="button" className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
        });
        return labelElems
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
            colorSettings += '.button.' +key+',.button.'+key+'.selected{background-color:' + this.props.labels[key].color + ';}'
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
                    <div className="label-selector-list">
                        {this.state.labelElems}
                    </div>
                </div>
            </div>
        )
    }

}
