// The component provides information to the user about ICS feed generation. It also gives
// them a button to click to generate an ICS feed.

import React from 'react';
import copy from 'copy-to-clipboard';
import axios from 'axios';
import { OutboundLink } from 'react-ga';


export default class GenerateICSPane extends React.Component {

    constructor(props) {
        super(props);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.getFeedUrl = this.getFeedUrl.bind(this);
    }

    getFeedUrl() {
        var labels = this.props.selectedLabels;
        var url = window.abe_url + '/subscriptions/'
        axios.post(url, {'labels': labels})
            .then(
                _response => this.copyToClipboard(window.abe_url + _response.data.ics_url),
                (jqXHR, _textStatus, _errorThrown) =>
                    alert('Failed to get Feed URL')
            )
    }

    copyToClipboard(url) {
        copy(url);
        this.props.icsUrlCopiedToClipboard(url);
        alert("Link copied to clipboard");
    }

    render() {
        return (
            <div>
                <span className="sidebar-item-info">Use an ICS feed to add events with the selected tags to your own calendar (
                    <OutboundLink
                        eventLabel="GitHub Wiki: Integrate with Your Calendar"
                        to="https://github.com/olinlibrary/abe-web/wiki/Integrate-with-Your-Calendar"
                        alt="Instructions for adding an ICS feed"
                        title="Instructions for adding an ICS feed"
                        target="_blank">
                        instructions
                    </OutboundLink>).</span>
                {/*<a className="ics-copy-to-clipboard" title="Copy feed URL" alt="Copy feed URL" onClick={this.getFeedUrl}>Copy link to clipboard</a>*/}
                <br/><br/>
                <input type="submit" className="button submit" value="Copy feed URL" onClick={this.getFeedUrl}/>

            </div>
        )
    }

}