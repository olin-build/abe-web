// This component allows the user to select a single date and time

import * as React from "react";
import ReactDOM from "react-dom";
import InputMoment from 'input-moment';
import moment from 'moment';

export default class EventDateTimeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.lostFocus = this.lostFocus.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            moment: moment(),
            pickerVisible: false
        };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
          moment: nextProps.datetime
      });
    }

    lostFocus(e) {
        this.setState({ pickerVisible: false });
    }

    buttonClicked(e) {
        this.setState({ pickerVisible: !this.state.pickerVisible });
    }

    handleChange(m) {
        this.setState({ moment: m });
        this.props.onChange(m);
    }

    handleSave(e) {
        this.setState({ pickerVisible: false });
    }

    render() {
        let buttonText = (this.props.buttonPrefix) ? this.props.buttonPrefix : '';
        buttonText += (this.props.show == 'date') ? this.state.moment.format('MMM D, YYYY') : this.state.moment.format('MMM D, YYYY h:mm A');
        return (
            <div className="date-time-container">
                <button className="button" onClick={this.buttonClicked}>{buttonText}</button>
                <div className="picker-popup-container">
                    <PickerPopup
                        visible={this.state.pickerVisible}
                        lostFocus={this.lostFocus}
                        moment={this.state.moment}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                        show={this.props.show}
                    />
                </div>
            </div>
        )
    }
}

class PickerPopup extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.finishedLoading = false;
    }

    componentWillMount() {
        // Add event listener for clicks
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        // Remove event listener for clicks
        document.removeEventListener('click', this.handleClick, false);
    }

    handleClick(e) {
        // Check if the user clicked outside the calendar selector
        if (this.props.visible){
            if (this.finishedLoading) { // Don't process the click triggering the display of this component
                let node = ReactDOM.findDOMNode(this);
                if (node !== null && !node.contains(e.target)) {
                    this.props.lostFocus();
                    this.finishedLoading = false;
                }
            } else {
                this.finishedLoading = true;
            }
        } else {
            this.finishedLoading = false;
        }
    }

    render() {
        if (this.props.visible) {
            return (
                <InputMoment
                    prevMonthIcon="ion-ios-arrow-left" // default
                    nextMonthIcon="ion-ios-arrow-right" // default
                    {...this.props}
                />
            )
        } else {
            return null
        }
    }

}
