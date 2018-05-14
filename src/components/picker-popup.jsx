import InputMoment from 'input-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import ReactDOM from 'react-dom';

export default class PickerPopup extends React.Component {
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
