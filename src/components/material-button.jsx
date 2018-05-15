// This component is an add (+) button following the Material Design style, like the button to create an event in
// Google Calendar

import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import AddIcon from '../../assets/icons/ic-add-circle.svg';

export default class MaterialButton extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    const classes = `btn-floating btn-large waves-effect waves-light blue ${this.props.className}`;
    return (
      <a className={classes}>
        <i className="material-icons" onClick={this.buttonClick}>
          {this.props.name}
        </i>
      </a>
    );
  }
}

// Define React prop types for type checking during development
MaterialButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
