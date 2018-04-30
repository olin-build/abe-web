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

    const temp_id = Math.random().toString(16).substring(2, 12)
      + Math.random().toString(16).substring(2, 12)
      + Math.random().toString(16).substring(2, 12);
    const temp_url = `/subscriptions/${temp_id}/ics`;
    this.copyToClipboard(temp_url);

    const url = `${window.abe_url}/subscriptions/${temp_id}`;

    axios.post(url, { labels })
      .then(
        (response) => {
          this.setState({ data: Object.assign({}, this.state.data, response.data) });
          if (response.data.ics_url !== temp_url) {
            // The server has returned an ICS url that is different than
            // the one we preemptively generated. This could happen if the format
            // of the URL changes in some future version, or if the server objects
            // to our generated ID for some reason and generates its own.
            //
            // This should never happen, but handling it here allows future changes
            // to URL format to be pushed separately to the backend and frontend
            // repos, with only slight user inconvenience during the transition.

            this.copyToClipboard(this.state.data.ics_url);
            console.warn(`Double copy needed because returned ics_url "${
              response.data.ics_url}" did not match expected "${temp_url}"`);
          }
          alert('Link copied to clipboard');
        },
        (_jqXHR, _textStatus, _errorThrown) =>
          alert('Failed to get Feed URL'),
      );
  }

  copyToClipboard(url) {
    copy(window.abe_url + url);

    this.props.icsUrlCopiedToClipboard(url);
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
              target="_blank"
            >
                instructions
            </OutboundLink>).
        </span>
        {/* <a className="ics-copy-to-clipboard" title="Copy feed URL" alt="Copy feed URL"
         onClick={this.getFeedUrl}>Copy link to clipboard</a> */}
        <br /><br />
        <input type="submit" className="button submit" value="Copy feed URL" onClick={this.getFeedUrl} />

        {this.state.data.id.length > 0 &&
        <a href={`/subscription/${this.state.data.id}`} className="ics-copy-to-clipboard" title="Edit feed preferences">
          Edit feed preferences
        </a>}
      </div>
    );
  }
}
