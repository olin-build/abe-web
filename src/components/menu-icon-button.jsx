import React from 'react';
import MenuIconSVG from 'svg-react-loader?name=Icon!../../assets/menu-icon.svg';

export default class MenuIconButton extends React.Component {

    render() {
        return (
            <button className="menu-icon-button" onClick={this.props.onClick} title={this.props.tooltip} alt={this.props.tooltip}><MenuIconSVG/></button>
        )
    }

}