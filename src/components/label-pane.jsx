// This component shows a list of event labels

import * as React from "react";
import PropTypes from 'prop-types';

export default class LabelPane extends React.Component {

    constructor(props) {
        super(props);
        if (props.refreshLabelsIfNeeded)
            props.refreshLabelsIfNeeded();
    }

    labelClicked = (labelName) => this.props.labelToggled(labelName);

    render() {
        let enableHoverStyle = !this.props.general.isMobile && this.props.editable;
        const noHoverText = enableHoverStyle ? '' : 'no-hover ';
        let labelElems = [];
        if (this.props.possibleLabels && this.props.selectedLabels) {
            Object.keys(this.props.possibleLabels).forEach((name) => {
                let tooltip = this.props.possibleLabels[name].description;
                let selected = this.props.selectedLabels.includes(name);
                if (selected || this.props.showUnselected) {
                    let classes = 'label ' + name + (selected ? ' selected' : '');
                    if (this.props.editable) {
                        labelElems.push(<button id={'label-' + name} key={name} title={tooltip} type="button"
                                              className={`button ${noHoverText}${classes}`}
                                              onClick={() => this.labelClicked(name)}>{name}</button>);
                    } else {
                        labelElems.push(<span id={'label-' + name} key={name} title={tooltip}
                                            className={classes}>{name}</span>);
                    }
                }
            });
        }
        let colorSettings = '';
        for (let name in this.props.possibleLabels) {
            let bgColor = this.props.possibleLabels[name].color;
            colorSettings += `.label.button.${name}:not(.no-hover):hover,.label.${name}.selected{background-color:${bgColor};}`;
        }
        return (
            <div className={this.props.contentClass}>
                <style type="text/css">{colorSettings}</style>
                <div className="label-selector-list">
                    {labelElems}
                </div>
            </div>
        )
    }

}

// Define React prop types for type checking during development
LabelPane.propTypes = {
    editable: PropTypes.bool,
    showUnselected: PropTypes.bool,
    possibleLabels: PropTypes.object,
    selectedLabels: PropTypes.array,
    contentClass: PropTypes.string,
};

// Define default values for React props
LabelPane.defaultProps = {
    editable: true,
    showUnselected: true,
};