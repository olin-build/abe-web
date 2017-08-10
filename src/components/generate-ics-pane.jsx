import React from 'react';
import copy from 'copy-to-clipboard';

export default class GenerateICSPane extends React.Component {

    constructor(props) {
        super(props);

        if (props.labels.visibleLabels) {
            this.state = {url: this.generateURL(props.labels.visibleLabels)};
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.labels.visibleLabels) {
            this.setState({url: this.generateURL(nextProps.labels.visibleLabels)});
        }
    }

    generateURL(labels) {
        labels = labels.filter(label => label.selected).map(label => label.name);
        return window.abe_url + '/ics/?labels=' + labels.join(',');
    }

    copyToClipboard = () => {
        copy(this.state.url);
        alert("Link copied to clipboard");
    };

    render() {
        return (
            <div>
                <span className="sidebar-item-info">Use an ICS feed to add events with the selected tags to your own calendar.</span>
                <a className="ics-copy-to-clipboard" title="Copy feed URL" alt="Copy feed URL" onClick={this.copyToClipboard}>Copy link to clipboard</a>
                <span className="ics-instructions">Instructions for adding to:&nbsp;
                    <a href="https://support.google.com/calendar/answer/37100" alt="Add Olin event calendar to Google Calendar"
                       title="Add Olin event calendar to Google Calendar" target="_blank">Google Calendar</a> ("Add using a link"),&nbsp;
                    <a href="https://support.office.com/en-us/article/Import-or-subscribe-to-a-calendar-in-Outlook-com-or-Outlook-on-the-web-CFF1429C-5AF6-41EC-A5B4-74F2C278E98C"
                       title="Add Olin event calendar to Outlook desktop or Outlook.com" alt="Add Olin event calendar to Outlook desktop or Outlook.com" target="_blank">
                        Outlook</a> (follow second half on subscribing).
                </span>
            </div>
        )
    }

}