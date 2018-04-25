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
        const {editable, possibleLabels, selectedLabels, showUnselected} = this.props;
        const enableHoverStyle = !this.props.general.isMobile && this.props.editable;
        const noHoverClass = enableHoverStyle ? '' : 'no-hover ';
        let labelElems = [];
        if (possibleLabels) {
            Object.keys(possibleLabels).forEach((name) => {
                const tooltip = possibleLabels[name].description;
                const selected = selectedLabels.includes(name);
                if (selected || showUnselected) {
                    const classes = 'label ' + name + (selected ? ' selected' : '');
                    const id = 'label-' + name;
                    if (editable) {
                        labelElems.push(<button id={id} key={name} title={tooltip} type="button"
                                              className={`button ${noHoverClass}${classes}`}
                                              onClick={() => this.labelClicked(name)}>{name}</button>);
                    } else {
                        labelElems.push(<span id={id} key={name} title={tooltip}
                                            className={classes}>{name}</span>);
                    }
                }
            });
        }
        let colorSettings = '';
        for (let name in possibleLabels) {
            const bgColor = possibleLabels[name].color;
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
    general: PropTypes.object,
    editable: PropTypes.bool,
    showUnselected: PropTypes.bool,
    possibleLabels: PropTypes.object,
    selectedLabels: PropTypes.array,
    contentClass: PropTypes.string,
};

// Define default values for React props
LabelPane.defaultProps = {
    general: {},
    editable: true,
    selectedLabels: [],
    showUnselected: true,
    contentClass: '',
};
