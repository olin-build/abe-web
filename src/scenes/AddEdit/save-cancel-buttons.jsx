import * as React from "react";

export default class SaveCancelButtons extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="form-submit-button-container">
                <button className="button cancel" onClick={this.props.onCancel} >Cancel</button>
                <button className="button submit" onClick={this.saveButtonClicked}>{this.props.submitButtonText}</button>
            </div>
        )
    }
}