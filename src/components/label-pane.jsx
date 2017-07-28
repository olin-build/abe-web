import * as React from "react";

export default class LabelPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          labelElems: []
        };
        if (props.refreshLabelsIfNeeded)
            props.refreshLabelsIfNeeded();
    }

    componentDidMount() {
        if (this.props.labels)
            this.processLabels(this.props.labels);
    }

    labelClicked = (labelName) => {
        this.props.labelVisibilityToggled(labelName);
    };

    componentWillReceiveProps = (nextProps) => {
        this.processLabels(nextProps.labels);
    };

    processLabels = (labels) => {
        let labelElems = [];
        Object.keys(labels).forEach( (name) => {
            let classes = labels[name].default ? 'button label selected '+ name: 'button label ' + name;
            labelElems.push(<button id={'label-'+name} key={name} title={labels[name].description} type="button" className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
        });
        this.setState({labelElems})
    };

    selectAll = () => {
      let labels = this.props.labels;
      for (let label in labels){
        if (labels[label].default === false){
          this.props.labelVisibilityToggled(labels[label].name)
        }
      }
    };

    selectNone = () => {
      let labels = this.props.labels;
      for (let label in labels){
        if (labels[label].default === true){
          this.props.labelVisibilityToggled(labels[label].name)
        }
      }
    };


    render() {
        let colorSettings = '';
        for (let key in this.props.labels) {
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            colorSettings += '.button.' +key+',.button.'+key+'.selected{background-color:' + this.props.labels[key].color + ';}'
          }
          else{
            colorSettings += '.button.' +key+',.button.' + key + ':hover,.button.'+key+'.selected{background-color:' + this.props.labels[key].color + ';}'
          }
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
