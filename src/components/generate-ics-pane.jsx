import React from 'react';

export default class GenerateICSPane extends React.Component {

    copyToClipboard = () => {

    };

    render() {
        return (
            <div>
                <p>Use an ICS feed to add events with the selected tags to your own calendar app (e.g. Google Calendar,
                    Outlook). New events will show up automatically.</p>
                {/*<input type="text" value={this.props.icsFeedURL} readOnly={true}/>*/}
                {/*<a onClick={this.copyToClipboard} title="Copy URL to clipboard" alt="Copy URL to clipboard"><CopyToClipboardIcon/></a>*/}
                <button className="button align-right" onClick={this.props.generateFeedClick}>Generate Feed</button>
            </div>
        )
    }

}