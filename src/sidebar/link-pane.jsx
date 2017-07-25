import React from 'react';

export default class LinkPane extends React.Component {


    render() {
        return (
            <div className={"link-pane " + this.props.className}>
                <button className="button" onClick={this.props.addEventClicked}>Add Event</button>
                <button className="button" onClick={this.props.importICSClicked}>Import Calendar</button>
            </div>
        )
    }

}