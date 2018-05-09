// This component allows the user to select a single date and time

import InputMoment from 'input-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import ReactDOM from 'react-dom';

export default class DateTimeSelector extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the state
    this.state = {
      moment: props.datetime,
      pickerVisible: false, // Date/time picker not visible
    };
  }

  // This function is called whenever the props on this component change (including during initialization)
  componentWillReceiveProps(nextProps) {
    this.setState({
      moment: nextProps.datetime,
    });
  }

  // Called when the picker loses focus
  lostFocus = () => {
    this.setState({ pickerVisible: false });
  };

  // Called when the button with (the date and time as its label) is clicked
  buttonClicked = () => {
    this.setState({ pickerVisible: !this.state.pickerVisible });
  };

  // Called when the user changes the date or time with the picker
  handleChange = (m) => {
    this.setState({ moment: m });
    this.props.onChange(m);
  };

  // Called when the user clicks the "Save" button in the picker
  // (We don't need to actually save the time because handleChange() was already called)
  handleSave = () => {
    this.setState({ pickerVisible: false });
  };

  render() {
    const buttonText =
      this.props.buttonPrefix +
      (this.props.show === 'date'
        ? this.state.moment.format('MMM D, YYYY')
        : this.state.moment.format('MMM D, YYYY h:mm A'));
    return (
      <div className="date-time-container">
        <button className="button" onClick={this.buttonClicked}>
          {buttonText}
        </button>
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
    );
  }
}

// Define React prop types for type checking during development
DateTimeSelector.propTypes = {
  buttonPrefix: PropTypes.string,
  datetime: PropTypes.instanceOf(moment),
  onChange: PropTypes.func.isRequired,
};

// Define default prop values
DateTimeSelector.defaultProps = {
  buttonPrefix: '',
  datetime: moment(),
};

class PickerPopup extends React.Component {
  constructor(props) {
    super(props);

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

  handleClick = (e) => {
    // Check if the user clicked outside the calendar selector
    if (this.props.visible) {
      if (this.finishedLoading) {
        // Don't process the click triggering the display of this component
        const node = ReactDOM.findDOMNode(this);
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
  };

  render() {
    return this.props.visible ? (
      <InputMoment
        prevMonthIcon="ion-ios-arrow-left" // default
        nextMonthIcon="ion-ios-arrow-right" // default
        {...this.props}
      />
    ) : null;
  }
}

// Define React prop types for type checking during development
PickerPopup.propTypes = {
  visible: PropTypes.bool,
  lostFocus: PropTypes.func.isRequired,
  moment: PropTypes.instanceOf(moment),
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  show: PropTypes.oneOf(['both', 'date', 'time']),
};

// Define default prop values
PickerPopup.defaultProps = {
  visible: false,
  moment: moment(),
  show: 'both',
};
