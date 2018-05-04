// This page component displays a list of labels.
//
// It's intended to make it easier for an administator to review the labels,
// their descriptions, colors, and flags.
//
// This isn't part of the public UI. It's not protected by auth, since it
// doesn't (yet) allow modifications to the set of labels, but there's no link
// to it.

import * as React from 'react';
import _ from 'lodash';

export default class LabelsPage extends React.Component {
  constructor(props) {
    super(props);
    props.refreshLabelsIfNeeded();
    this.props.setSidebarMode();
    props.setPageTitlePrefix('Labels');
  }

  render() {
    if (!this.props.labels) {
      return <div>loading</div>;
    }
    const labels = _.sortBy(Object.values(this.props.labels), ({ name }) => name.toLowerCase());
    return (
      <div className="row expanded page-container">
        <div className="row content-container">
          <h1 className="page-title">Labels</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Color</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {labels.map(label => (
                <tr key={label.id}>
                  <td>{label.name}</td>
                  <td>{label.description}</td>
                  <td style={{ backgroundColor: label.color }}>{label.color}</td>
                  <td>
                    <LabelFlag
                      symbol="✔"
                      value={label.default}
                      name="Default"
                      description="Selected when the calendar is loaded"
                    />
                    {/* TODO: Update label.public to whatever the property ends up being named */}
                    <LabelFlag
                      symbol="👥"
                      value={label.public}
                      name="Public"
                      description="Events with this label are visible otuside Olin"
                    />
                    {/* TODO: Update label.protected to whatever the property ends up being named */}
                    <LabelFlag
                      symbol="🔒"
                      value={label.protected}
                      name="Locked"
                      description="This label may only be added by an administrator"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const LabelFlag = (props) => {
  const title = `${props.name}. ${props.description}`;
  return props.value ? (
    <span role="img" title={title} aria-label={title} style={{ cursor: 'pointer' }}>
      {props.symbol}
    </span>
  ) : (
    <span />
  );
};
