import * as React from "react";

export default class EventVisibilitySelector extends React.Component {
    render() {
        return (
            <div className="radio-collection-container">
                <span className="radio-collection-title">Visibility</span>
                <div className="radio-collection-options-container">
                    <div className="radio-option">
                        <input type="radio" id="privacy-public" name="privacy" value="public" title="Public"/>
                        <label htmlFor="privacy-public">Public</label>
                    </div>
                    <div className="radio-option">
                        <input type="radio" id="privacy-olin" name="privacy" value="olin" title="Olin Students, Faculty and Staff Only"/>
                        <label htmlFor="privacy-olin">Students, Faculty and Staff Only</label>
                    </div>
                    <div className="radio-option">
                        <input type="radio" id="privacy-students" name="privacy" value="students" title="Students Only"/>
                        <label htmlFor="privacy-students">Students</label>
                    </div>
                </div>
            </div>
        )
    }
}