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
    const { props } = this;
    const {
      disableProtectedLabels, editable, selectedLabels, showUnselected,
    } = this.props;
    const enableHoverStyle = !this.props.general.isMobile && props.editable;
    const noHoverClass = enableHoverStyle ? '' : 'no-hover';
    // sort Featured first; then remaining default labels, alphabetically within
    // each section
    let labels = _.chain(this.props.possibleLabels || {})
      .sortBy(label => label.name.toLowerCase())
      .sortBy(label => !label.default)
      .sortBy(label => !initialLabels.includes(label.name.toLowerCase()))
      .value();
    if (disableProtectedLabels) {
      labels = _.sortBy(labels, label => Boolean(label.protected));
    }
    if (!showUnselected) {
      labels = labels.filter(({ name }) => selectedLabels.includes(name));
    }
    const labelClicked = labelName => props.labelToggled(labelName);
    const visibilityIcons = {
      public: 'ion-android-people',
      olin: null,
      students: 'ion-university',
    };

    function renderLabel(label) {
      const { description: tooltip, name, id } = label;
      const selected = selectedLabels.includes(name);
      const cssId = `label-${id}`;
      const disabled = disableProtectedLabels && label.protected;
      const classes = `label ${cssId} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`;
      const iconClass =
        disableProtectedLabels && label.protected
          ? 'ion-android-lock'
          : visibilityIcons[label.visibility] || 'ion-pricetag';
      const icon = <span className={iconClass}>&nbsp;</span>;
      return editable ? (
        <button
          id={id}
          key={name}
          title={tooltip}
          type="button"
          className={`button ${noHoverClass} ${classes}`}
          onClick={() => !disabled && labelClicked(name)}
        >
          {icon}
          {name}
        </button>
      ) : (
        <span id={id} key={name} title={tooltip} className={classes}>
          {icon}
          {name}
        </span>
      );
    }
    function getLabelCss(label) {
      const { color, id } = label;
      const sel = `.label.label-${id}`;
      // Joining the list of strings, and then again the caller, is less
      // efficient, but I found it clearer, and this code is not run much
      // and hasn't shown up as a hot spot.
      //
      // Join w/ '\n', here and in caller, for more readable debugging and
      // snapshots.
      return [
        `${sel}.selected{background-color:${color}}`,
        `${sel}.selected:not(.disabled):not(.no-hover):hover,`,
        `${sel}:not(.selected)`,
        `{background-color:white;border-color:${color};color:${color}}`,
        `${sel}:not(.disabled):not(.no-hover):hover`,
        `{background-color:${color || 'black'};color:white}`,
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
  disableProtectedLabels: PropTypes.bool,
  showUnselected: PropTypes.bool,
  possibleLabels: PropTypes.objectOf(PropTypes.shape({
    color: PropTypes.string,
    description: PropTypes.string,
    protected: PropTypes.bool,
    visbility: PropTypes.string,
  })),
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  contentClass: PropTypes.string,
};

// Define default values for React props
LabelPane.defaultProps = {
  general: {},
  editable: true,
  disableProtectedLabels: false,
  possibleLabels: {},
  selectedLabels: [],
  showUnselected: true,
  contentClass: '',
};
