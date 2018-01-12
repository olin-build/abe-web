// This component is displayed at the top of the calendar

import React from 'react';

export default class CalendarHeader extends React.Component {

    render() {
        return (
            <div className="calendar-header">
                <span className="title">{this.props.title}</span>
                <div className="calendar-header-pagination">
                    <button onClick={this.props.onLeftClick}>&lt;</button>
                    <button onClick={this.props.onTodayClick}>Today</button>
                    <button onClick={this.props.onRightClick}>&gt;</button>
                </div>
            </div>
        )
    }

}