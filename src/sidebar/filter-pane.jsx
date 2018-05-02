// This component is a sidebar pane/section for filtering events.

import React from 'react';
import LabelPane from '../components/label-pane';

export default class FilterPane extends React.Component {
  selectLabels = (allNoneDefault) => {
    let visibleLabels;
    switch (allNoneDefault) {
      case 'all':
        visibleLabels = Object.values(this.props.possibleLabels).map(l => l.name);
        break;
      case 'none':
        visibleLabels = [];
        break;
      case 'default':
        visibleLabels = Object.values(this.props.possibleLabels).filter(l => l.default).map(l => l.name);
        break;
      default:
      // Do nothing
    }
    this.props.setVisibleLabels(visibleLabels, allNoneDefault);
  };

  render() {
    return (
      <div className={`filter-pane ${this.props.className}`}>
        <div className="sidebar-item-subsection-header">
          <span className="sidebar-item-subsection-title">Labels</span>
          <div className="align-right">
            <a onClick={() => this.selectLabels('all')}>All</a>
            &nbsp;|&nbsp;
            <a onClick={() => this.selectLabels('default')}>Default</a>
            &nbsp;|&nbsp;
            <a onClick={() => this.selectLabels('none')}>None</a>
          </div>
        </div>
        <LabelPane {...this.props} />
      </div>
    );
  }
}
