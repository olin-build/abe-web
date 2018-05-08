// The component provides information to the user about ICS feed generation. It also gives
// them a button to click to generate an ICS feed.

import axios from 'axios';
import copy from 'copy-to-clipboard';
import React from 'react';
import { OutboundLink } from 'react-ga';

export default class GenerateICSPane extends React.Component {
  constructor(props) {
    super(props);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.getFeedUrl = this.getFeedUrl.bind(this);

    this.state = {
      data: {
        labels: [],
        id: '',
        ics_url: '',
      },
    };
  }

  getFeedUrl() {
    // In order to copy the URL as a direct response to the button click,
    // a temporary ID is generated, and preemptively copied, but the success
    // message is not displayed until the request returns. If the response
    // has a different URL for some reason, it is copied again, requiring
    // the user to press "control-C".

    const labels = this.props.selectedLabels;

    const url = `${window.abe_url}/subscriptions/`;

    axios.post(url, { labels }).then(
      (response) => {
        this.setState({ data: Object.assign({}, this.state.data, response.data) });
      },
      (_jqXHR, _textStatus, _errorThrown) => alert('Failed to get Feed URL'),
    );
  }

  copyToClipboard(url) {
    copy(window.abe_url + url);

    this.props.icsUrlCopiedToClipboard(url);
    alert('Feed URL copied to clipboard');
  }

  render() {
    return (
      <div>
        <span className="sidebar-item-info">
          Use an ICS feed to add events with the selected tags to your own calendar (
          <OutboundLink
            eventLabel="GitHub Wiki: Integrate with Your Calendar"
            to="https://github.com/olinlibrary/abe-web/wiki/Integrate-with-Your-Calendar"
            alt="Instructions for adding an ICS feed"
            title="Instructions for adding an ICS feed"
            target="_blank"
          >
            instructions
          </OutboundLink>).
        </span>
        {/* <a className="ics-copy-to-clipboard" title="Copy feed URL" alt="Copy feed URL"
         onClick={this.getFeedUrl}>Copy link to clipboard</a> */}
        <br />
        <br />
        <input type="submit" className="button submit" value="Generate event feed" onClick={this.getFeedUrl} />

        {this.state.data.id.length > 0 && (
          <div>
            <a
              href={`/subscription/${this.state.data.id}`}
              className="ics-copy-to-clipboard"
              title="Edit feed preferences"
            >
              Edit feed preferences
            </a>

            <a
              href={`webcal:${window.abe_url.split(':')[1]}${this.state.data.ics_url}`}
              className="ics-copy-to-clipboard"
            >
              Import into Outlook
            </a>

            <a
              href="https://github.com/olinlibrary/abe-web/wiki/Integrate-with-Your-Calendar#step-2-b-google-calendar"
              className="ics-copy-to-clipboard"
              onClick={() => {
                this.copyToClipboard(this.state.data.ics_url);
              }}
            >
              Import into Google Calendar
            </a>
          </div>
        )}
      </div>
    );
  }
}
