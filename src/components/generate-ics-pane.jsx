import React from 'react';

export default class GenerateICSPane extends React.Component {

    render() {
        return (
            <div>
                <p>Generate an ICS feed to add events matching the current filter to your own calendar app (e.g. Google Calendar, Outlook).</p>
                <button className="button align-right" onClick={this.props.generateFeedClick}>Generate Feed</button>
            </div>
        )
    }

}