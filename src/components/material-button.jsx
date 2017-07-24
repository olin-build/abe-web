import React, {Component} from "react";
// import AddIcon from 'svg-react-loader?name=Icon!../../assets/icons/ic-add-circle.svg';

export default class AddButton extends Component {

    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick(e) {
        e.preventDefault();
        if (this.props.onClick)
            this.props.onClick(e);
    }

    render() {
        let classes = "btn-floating btn-large waves-effect waves-light blue " + this.props.className;
        return (
            <a className={classes}><i className="material-icons" onClick={this.buttonClick}>{this.props.name}</i></a>
        )
    }

}