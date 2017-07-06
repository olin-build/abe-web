import * as React from "react";

export default class SaveCancelButtons extends React.Component {

    render() {
        // Only render delete button if we're supposed to
        let deleteButton = this.props.showDelete ? <button className="button delete" onClick={this.props.onDelete}>{'deleteButtonText' in this.props ? this.props.deleteButtonText : 'Delete'}</button> : null;
        return (
            <div className="form-submit-button-container">
                { deleteButton }
                <button className="button cancel" onClick={this.props.onCancel}>{'cancelButtonText' in this.props ? this.props.cancelButtonText : 'Cancel'}</button>
                <button className="button submit" onClick={this.props.onSubmit}>{'submitButtonText' in this.props ? this.props.submitButtonText : 'Submit'}</button>
            </div>
        )
    }
}