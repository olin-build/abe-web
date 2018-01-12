// This component contains a collection of buttons for starting various general tasks

import React from 'react';
import PropTypes from 'prop-types';

export default class ButtonPane extends React.Component {


    render() {
        return (
            <div className={"link-pane " + this.props.className}>
                <button className="button" onClick={this.props.addEventClicked}>Add Event</button>
                <button className="button" onClick={this.props.importICSClicked}>Import Calendar</button>
            </div>
        )
    }

}

// Define React property types for type checking during development
ButtonPane.propTypes = {
    addEventClicked: PropTypes.func,
    importICSClicked: PropTypes.func,
};