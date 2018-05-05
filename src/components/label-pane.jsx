// This component shows a list of event labels

import _ from 'lodash';
import PropTypes from 'prop-types';
import * as React from 'react';

const initialLabels = ['featured'];

export default class LabelPane extends React.Component {
  constructor(props) {
    super(props);
    if (props.refreshLabelsIfNeeded) props.refreshLabelsIfNeeded();
  }

  render() {
    const { editable, selectedLabels, showUnselected } = this.props;
    const enableHoverStyle = !this.props.general.isMobile && this.props.editable;
    const noHoverClass = enableHoverStyle ? '' : 'no-hover ';
    // sort Featured first; then remaining default labels, alphabetically within
    // each section
    let labels = _.chain(this.props.possibleLabels || {})
      .sortBy(label => label.name.toLowerCase())
      .sortBy(label => !label.default)
      .sortBy(label => !initialLabels.includes(label.name.toLowerCase()))
      .value();
    if (!showUnselected) {
      labels = labels.filter(({ name }) => selectedLabels.includes(name));
    }
    const labelClicked = labelName => this.props.labelToggled(labelName);

    function renderLabel(label) {
      const { description: tooltip, name, id } = label;
      const selected = selectedLabels.includes(name);
      const cssId = `label-${id}`;
      const classes = `label ${cssId}${selected ? ' selected' : ''}`;
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
    function getLabelCss(label) {
      const { color, id } = label;
      const cssId = `label-${id}`;
      // Joining the list of strings, and then again the caller, is less
      // efficient, but I found it clearer, and this code is not run much
      // and hasn't shown up as a hot spot.
      //
      // Join w/ '\n', here and in caller, for more readable debugging and
      // snapshots.
      return [
        `.label.${cssId}.button:not(.selected){background-color:white;}`,
        `.label.${cssId}:not(.button):not(.selected){border-color:${color};color:${color};}`,
        // hovered button, or selected
        `.label.button.${cssId}:not(.no-hover):hover,.label.${cssId}.selected{background-color:${color};}`,
      ].join('\n');
    }

    return (
      <div className={this.props.contentClass}>
        <style type="text/css">{labels.map(getLabelCss).join('\n')}</style>
        <div className="label-selector-list">{labels.map(renderLabel)}</div>
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
