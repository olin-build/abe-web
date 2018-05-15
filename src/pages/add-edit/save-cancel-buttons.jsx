// This component allows the user to save or cancel editing an event

import * as React from 'react';

const SaveCancelButtons = (props) => {
  // Only render delete button if we're supposed to
  const deleteButton = props.showDelete && (
    <button className="button delete" onClick={props.onDelete} disabled={props.disabled}>
      {'deleteButtonText' in props ? props.deleteButtonText : 'Delete'}
    </button>
  );
  return (
    <div className="form-submit-button-container">
      {deleteButton}
      <button className="button cancel" onClick={props.onCancel}>
        {'cancelButtonText' in props ? props.cancelButtonText : 'Cancel'}
      </button>
      <button className="button submit" onClick={props.onSubmit} disabled={props.disabled}>
        {'submitButtonText' in props ? props.submitButtonText : 'Submit'}
      </button>
    </div>
  );
};

export default SaveCancelButtons;
