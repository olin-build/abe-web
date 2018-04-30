// This component is used to select the visibility (public, Olin-only, etc) of an event
// (This information is currently unused)

import * as React from 'react';

export default class EventVisibilitySelector extends React.Component {
  constructor(props) {
    super(props);
    this.radioCheckedHandler = this.radioCheckedHandler.bind(this);
  }

  radioCheckedHandler(e) {
    this.props.onChange(e.currentTarget.value);
  }

  render() {
    return (
      <div className={`radio-collection-container ${this.props.className}`}>
        <span className="radio-collection-title">Visibility</span>
        <div className="radio-collection-options-container">
          <div className="radio-option">
            <input
type="radio"
id="privacy-public"
name="privacy"
value="public"
title="Public"
                   checked={this.props.visibility === 'public'}
onChange={this.radioCheckedHandler}
            />
            <label htmlFor="privacy-public">Public</label>
          </div>
          <div className="radio-option">
            <input
type="radio"
id="privacy-olin"
name="privacy"
value="olin"
title="Olin Community Only"
                   checked={this.props.visibility === 'olin'}
onChange={this.radioCheckedHandler}
            />
            <label htmlFor="privacy-olin">Olin Community Only</label>
          </div>
        </div>
      </div>
    );
  }
}
