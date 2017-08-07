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
            this.processLabels(this.props.labels.labelList, this.props.labels.visibleLabels);
    }

    labelClicked = (labelName) => {
        this.props.labelVisibilityToggled(labelName);
    };

    componentWillReceiveProps = (nextProps) => {
        this.processLabels(nextProps.labels.labelList, nextProps.labels.visibleLabels);
    };

    processLabels = (labels, visibleLabels) => {
        let labelElems = [];
        if (labels && visibleLabels) {
            Object.keys(labels).forEach((name) => {
                let classes = (visibleLabels && visibleLabels.includes(name)) ? 'button label selected ' + name : 'button label ' + name;
                labelElems.push(<button id={'label-' + name} key={name} title={labels[name].description} type="button"
                                        className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
            });
        }
        this.setState({labelElems})
    };

    render() {
        let colorSettings = '';
        for (let key in this.props.labels.labelList) {
            let backgroundColor = this.props.labels.labelList[key].color;
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            colorSettings += '.button.' +key+',.button.'+key+'.selected{background-color:' + backgroundColor + ';}';
          }
          else{
            colorSettings += '.button.' +key+',.button.' + key + ':hover,.button.'+key+'.selected{background-color:' + backgroundColor + ';}';
          }
        }
        return (
            <div>
                <style type="text/css">{colorSettings}</style>
                <div className={this.props.contentClass}>
                    <div className="label-selector-list">
                        {this.state.labelElems}
                    </div>
                </div>
            </div>
        )
    }

}
