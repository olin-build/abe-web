// This component allows the user to import a calendar from an ICS feed

import axios from 'axios';
import * as React from 'react';
import TagPane from '../../components/label-pane';
import MenuIconButton from '../../components/menu-icon-button';
import SidebarModes from '../../data/sidebar-modes';
import { API_SERVER_URL } from '../../data/settings';

export default class ImportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      importData: {
        labels: [],
        url: '',
      },
    };
    this.props.setSidebarMode(SidebarModes.IMPORT);
    props.setPageTitlePrefix('Import Calendar');
  }

  labelToggled = (labelName) => {
    const labels = this.state.importData.labels.slice();
    if (labels.includes(labelName)) {
      labels.splice(labels.indexOf(labelName), 1);
    } else {
      labels.push(labelName);
    }
    this.setState({ importData: Object.assign({}, this.state.importData, { labels }) });
  };

  urlChanged = (e) => {
    const importData = Object.assign(this.state.importData, { url: e.currentTarget.value });
    this.setState({ importData });
  };

  submitICS = () => {
    axios
      .post(`${API_SERVER_URL}/ics/`, this.state.importData)
      .then(
        response => this.props.importSuccess(response, this.state.importData),
        (jqXHR, textStatus, errorThrown) => this.props.importFailed(errorThrown, jqXHR.message),
      );
  };

  render() {
    return (
      <div className="row expanded page-container">
        <div className="row content-container">
          <h1 className="page-title">
            <MenuIconButton
              onClick={this.props.toggleSidebarCollapsed}
              tooltip="Show/Hide Sidebar"
            />
            Import
          </h1>
          <input
            required="required"
            type="url"
            placeholder=".../example_calendar.ics"
            className="wide-text-box single-line-text-box medium-text-box"
            onChange={this.urlChanged}
          />
          <TagPane
            contentClass="import-filters"
            {...this.props}
            possibleLabels={this.props.labels}
            selectedLabels={this.state.importData.labels}
            labelToggled={this.labelToggled}
          />
          <br />
          <input type="submit" className="button submit" value="Submit" onClick={this.submitICS} />
        </div>
      </div>
    );
  }
}
