// This component contains a collection of buttons for starting various general tasks

import PropTypes from 'prop-types';
import React from 'react';

const ButtonPane = props => (
  <div className={`link-pane ${props.className}`}>
    <button className="button" onClick={props.addEventClicked}>
      Add Event
    </button>
    <button className="button" onClick={props.importICSClicked}>
      Import Calendar
    </button>
  </div>
);

// Define React property types for type checking during development
ButtonPane.propTypes = {
  addEventClicked: PropTypes.func.isRequired,
  importICSClicked: PropTypes.func.isRequired,
};

export default ButtonPane;
