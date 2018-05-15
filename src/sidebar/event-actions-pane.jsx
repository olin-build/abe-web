// This sidebar pane allows the user to perform actions on an event currently being viewed

import React from 'react';

const EventActionsPane = (props) => {
  if (!props.currentEvent) return null;

  const editRecurrence = props.currentEvent.recId ? (
    <button className="button" onClick={props.editEventSeries}>
      Edit Series
    </button>
  ) : null;
  const mainEditButtonText = props.currentEvent.recId ? 'Edit Recurrence' : 'Edit Event';

  return (
    <div className={`link-pane ${props.className}`}>
      {editRecurrence}
      <button className="button" onClick={props.editCurrentEvent}>
        {mainEditButtonText}
      </button>
      {/* <button className="button" onClick={props.deleteCurrentEvent}>Delete Event</button> */}
    </div>
  );
};

export default EventActionsPane;
