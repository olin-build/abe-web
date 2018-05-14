// This component allows the user to import a calendar from an ICS feed

import axios from 'axios';
import copy from 'copy-to-clipboard';
import * as React from 'react';
import TagPane from '../../components/label-pane';
import MenuIconButton from '../../components/menu-icon-button';
import SidebarModes from '../../data/sidebar-modes';
import docs from '../../docs';

export default class SubscriptionEditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: [],
        id: '',
        ics_url: '',
      },
    };

    axios
      .get(`${window.abe_url}/subscriptions/${this.getIdFromURL(props)}`)
      .then(
        response => this.setState({ data: Object.assign({}, this.state.data, response.data) }),
        (jqXHR, textStatus, errorThrown) => this.props.importFailed(errorThrown, jqXHR.message),
      );

    this.props.setSidebarMode(SidebarModes.IMPORT);
    props.setPageTitlePrefix('Edit Subscription');

    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  getIdFromURL = (props) => {
    if ('match' in props && 'id' in props.match.params) {
      return props.match.params.id;
    }
    return null;
  };

  labelToggled = (labelName) => {
    const labels = this.state.data.labels.slice();
    if (labels.includes(labelName)) {
      labels.splice(labels.indexOf(labelName), 1);
    } else {
      labels.push(labelName);
    }
    this.setState({ data: Object.assign({}, this.state.data, { labels }) });
  };

  // urlChanged = (e) => {
  //     let importData = this.state.importData;
  //     importData = Object.assign(importData, {url: e.currentTarget.value});
  //     this.setState({importData : importData});
  // };

  submitSubscription = () => {
    axios.put(`${window.abe_url}/subscriptions/${this.state.data.id}`, this.state.data).then(
      (response) => {
        this.setState({ data: Object.assign({}, this.state.data, response.data) });
        this.props.importSuccess(response, response.data);
      },
      (jqXHR, textStatus, errorThrown) => this.props.importFailed(errorThrown, jqXHR.message),
    );
  };

  copyToClipboard() {
    const url = window.abe_url + this.state.data.ics_url;
    copy(url);
    alert('Link copied to clipboard');
  }

  render() {
    return (
      <div className="row expanded page-container">
        <div className="row content-container">
          <h1 className="page-title">
            <MenuIconButton
              onClick={this.props.toggleSidebarCollapsed}
              tooltip="Show/Hide Sidebar"
            />
            Edit Subscription: {this.state.data.id}
          </h1>
          <h2>Tags:</h2>
          <TagPane
            contentClass="import-filters"
            possibleLabels={this.props.labels}
            selectedLabels={this.state.data.labels}
            labelToggled={this.labelToggled}
            {...this.props}
          />
          <br />
          <input
            type="submit"
            className="button submit"
            value="Submit"
            onClick={this.submitSubscription}
          />
          <br />
          <a
            href={`webcal:${window.abe_url.split(':')[1]}${this.state.data.ics_url}`}
            className="ics-copy-to-clipboard"
          >
            Import into Outlook
          </a>

          <a
            href={docs.googleCalendarUrl}
            className="ics-copy-to-clipboard"
            target="_blank"
            onClick={() => {
              this.copyToClipboard(this.state.data.ics_url);
            }}
          >
            Import into Google Calendar
          </a>
        </div>
      </div>
    );
  }
}
