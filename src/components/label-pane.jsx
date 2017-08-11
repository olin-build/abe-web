import * as React from "react";

export default class LabelPane extends React.Component {

    constructor(props) {
        super(props);
        if (props.refreshLabelsIfNeeded)
            props.refreshLabelsIfNeeded();
    }

    labelClicked = (labelName) => {
        this.props.labelToggled(labelName);
    };

    render() {
        let labelElems = [];
        if (this.props.possibleLabels && this.props.selectedLabels) {
            Object.keys(this.props.possibleLabels).forEach((name) => {
                let classes = 'button label ' + name + (this.props.selectedLabels.includes(name) ? ' selected' : '');
                labelElems.push(<button id={'label-' + name} key={name} title={this.props.possibleLabels[name].description} type="button"
                                        className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
            });
        }
        let colorSettings = '';
        for (let key in this.props.possibleLabels) {
            let backgroundColor = this.props.possibleLabels[key].color;
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
                        {labelElems}
                    </div>
                </div>
            </div>
        )
    }

}
