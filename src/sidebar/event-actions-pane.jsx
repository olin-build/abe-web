// This sidebar pane allows the user to perform actions on an event currently being viewed

import React from 'react';

export default class EventActionsPane extends React.Component {
  render() {
    if (!this.props.currentEvent) return null;

    const editRecurrence = this.props.currentEvent.recId ? (
      <button className="button" onClick={this.props.editEventSeries}>Edit Series</button>
    ) : null;
    const mainEditButtonText = this.props.currentEvent.recId ? 'Edit Recurrence' : 'Edit Event';

    return (
      <div className={`link-pane ${this.props.className}`}>
        {editRecurrence}
        <button className="button" onClick={this.props.editCurrentEvent}>{mainEditButtonText}</button>
        {/* <button className="button" onClick={this.props.deleteCurrentEvent}>Delete Event</button> */}
      </div>
    );
  }
}
