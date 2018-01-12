// This sidebar pane allows the user to perform actions on an event currently being viewed

import React from 'react';

export default class EventActionsPane extends React.Component {


    render() {
        let idSuffix;
        if (this.props.currentEvent) {
            let id = this.props.currentEvent.id;
            let sid = this.props.currentEvent.sid;
            let rec_id = moment.utc(Number(this.props.currentEvent.rec_id)).toString(); // Reformat as ms since UNIX epoch
            idSuffix = id ? id.toString() : (sid + '/' + rec_id);
        }

        return (
            <div className={"link-pane " + this.props.className}>
                <button className="button" onClick={() => this.props.editEvent(idSuffix)}>Edit Event</button>
                {/*<button className="button" onClick={this.props.deleteCurrentEvent}>Delete Event</button>*/}
            </div>
        )
    }

}