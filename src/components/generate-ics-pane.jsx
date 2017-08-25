import React from 'react';
import copy from 'copy-to-clipboard';

export default class GenerateICSPane extends React.Component {

    constructor(props) {
        super(props);
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    copyToClipboard() {
        if (this.props.selectedLabels.length > 0) {
            let url = window.abe_url + '/ics/?labels=' + this.props.selectedLabels.join(',');
            copy(url);
            alert("Link copied to clipboard");
        } else {
            alert('You must select at least one event tag.')
        }
    }

    render() {
        return (
            <div>
                <span className="sidebar-item-info">Use an ICS feed to add events with the selected tags to your own calendar (
                    <a href="https://github.com/olinlibrary/abe-web/wiki/Integrate-with-Your-Calendar"
                       alt="Instructions for adding an ICS feed"
                       title="Instructions for adding an ICS feed"
                       target="_blank">
                        instructions
                    </a>).</span>
                <a className="ics-copy-to-clipboard" title="Copy feed URL" alt="Copy feed URL" onClick={this.copyToClipboard}>Copy link to clipboard</a>

            </div>
        )
    }

}