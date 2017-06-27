import * as React from "react";

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
            <div className="radio-collection-container">
                <span className="radio-collection-title">Visibility</span>
                <div className="radio-collection-options-container">
                    <div className="radio-option">
                        <input type="radio" id="privacy-public" name="privacy" value="public" title="Public" checked={this.props.visibility === 'public'} onChange={this.radioCheckedHandler}/>
                        <label htmlFor="privacy-public">Public</label>
                    </div>
                    <div className="radio-option">
                        <input type="radio" id="privacy-olin" name="privacy" value="olin" title="Olin Students, Faculty and Staff Only" checked={this.props.visibility === 'olin'} onChange={this.radioCheckedHandler}/>
                        <label htmlFor="privacy-olin">Students, Faculty and Staff Only</label>
                    </div>
                    <div className="radio-option">
                        <input type="radio" id="privacy-students" name="privacy" value="students" title="Students Only" checked={this.props.visibility === 'students'} onChange={this.radioCheckedHandler}/>
                        <label htmlFor="privacy-students">Students</label>
                    </div>
                </div>
            </div>
        )
    }
}