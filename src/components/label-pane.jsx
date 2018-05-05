// This component shows a list of event labels

import * as React from 'react';
import PropTypes from 'prop-types';

export default class LabelPane extends React.Component {
  constructor(props) {
    super(props);
    if (props.refreshLabelsIfNeeded) props.refreshLabelsIfNeeded();
  }

  render() {
    const {
      editable, possibleLabels: labels, selectedLabels, showUnselected,
    } = this.props;
    if (!labels) {
      return <div className="loading" />;
    }
    const enableHoverStyle = !this.props.general.isMobile && this.props.editable;
    const noHoverClass = enableHoverStyle ? '' : 'no-hover ';
    let labelKeys = Object.keys(labels);
    if (!showUnselected) {
      labelKeys = Object.select(labelKeys, selectedLabels.includes);
    }
    const labelClicked = labelName => this.props.labelToggled(labelName);

    function renderLabel(name) {
      const tooltip = labels[name].description;
      const selected = selectedLabels.includes(name);
      const classes = `label ${name}${selected ? ' selected' : ''}`;
      const id = `label-${name}`;
      return editable ? (
        <button
          id={id}
          key={name}
          title={tooltip}
          type="button"
          className={`button ${noHoverClass}${classes}`}
          onClick={() => labelClicked(name)}
        >
          <span className="ion-pricetag">&nbsp;</span>
          {name}
        </button>
      ) : (
        <span id={id} key={name} title={tooltip} className={classes}>
          <span className="ion-pricetag">&nbsp;</span>
          {name}
        </span>
      );
    }
    function getLabelCss(name) {
      const { color } = labels[name];
      // Joining the list of strings, and then again the caller, is less
      // efficient, but I found it clearer, and this code is not run much
      // and hasn't shown up as a hot spot.
      //
      // Join w/ '\n', here and in caller, for more readable debugging and
      // snapshots.
      return [
        `.label.${name}.button:not(.selected){background-color:white;}`,
        `.label.${name}:not(.button):not(.selected){border-color:${color};color:${color};}`,
        // hovered button, or selected
        `.label.button.${name}:not(.no-hover):hover,.label.${name}.selected{background-color:${color};}`,
      ].join('\n');
    }

    return (
      <div className={this.props.contentClass}>
        <style type="text/css">{labelKeys.map(getLabelCss).join('\n')}</style>
        <div className="label-selector-list">{labelKeys.map(renderLabel)}</div>
      </div>
    );
  }
}

// Define React prop types for type checking during development
LabelPane.propTypes = {
  general: PropTypes.shape({ isMobile: PropTypes.bool }),
  editable: PropTypes.bool,
  showUnselected: PropTypes.bool,
  possibleLabels: PropTypes.objectOf(PropTypes.shape({
    color: PropTypes.string,
    description: PropTypes.string,
  })),
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  contentClass: PropTypes.string,
};

// Define default values for React props
LabelPane.defaultProps = {
  general: {},
  editable: true,
  possibleLabels: {},
  selectedLabels: [],
  showUnselected: true,
  contentClass: '',
};
