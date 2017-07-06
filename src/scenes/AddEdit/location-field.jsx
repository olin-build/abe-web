import * as React from "react";

export default class LocationField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.tryParseLocationInput = this.tryParseLocationInput.bind(this);
        this.resolveBuilding = this.resolveBuilding.bind(this);
        this.textChanged = this.textChanged.bind(this);

        // Matching substrings for each building. Should be lowercase.
        this.MILAS_HALL_MATCHES = ['mh', 'milas'];
        this.CAMPUS_CENTER_MATCHES = ['cc', 'campus center', 'campuscenter'];
        this.ACADEMIC_CENTER_MATCHES = ['ac', 'academic center', 'academiccenter'];
        this.WEST_HALL_MATCHES = ['wh', 'west hall', 'westhall'];
        this.EAST_HALL_MATCHES = ['eh', 'east hall', 'easthall'];
        this.LOUNGE_MATCHES = ['l', 'lounge'];
        this.ANTI_LOUNGE_MATCHES = ['al', 'anti-lounge', 'antilounge'];
        this.NOOK_MATCHES = ['n', 'nook'];
    }

    textChanged() {
        let locationField = $('#location');
        let res = this.tryParseLocationInput(locationField.val());
        if (!res) {
            locationField.addClass('is-invalid-input');
        } else {
            locationField.removeClass('is-invalid-input');
            this.setState({
                building: res.building,
                room: res.room,
                suffix: res.suffix
            });
        }

    }

    tryParseLocationInput(string) {
        if (string.length === 0)
            return {};
        string = string.toLowerCase();
        let buildingRegex = /^\D+/;
        let roomRegex = /\d+/;
        let suffixRegex = /\D*$/;
        let building = this.resolveBuilding(buildingRegex.exec(string));
        let room = this.resolveRoom(roomRegex.exec(string));
        let suffix = this.resolveSuffix(suffixRegex.exec(string)); // TODO Handle kitchen, gym, etc
        if (!building || !room)
            return null;

        return {building: building, room: room, suffix: suffix};
    }

    resolveBuilding(buildingString) {

        if (buildingString && buildingString.length > 0) {
            buildingString = buildingString[0];

            if (this.stringContains(buildingString, this.MILAS_HALL_MATCHES)) {
                return 'MH';
            } else if (this.stringContains(buildingString, this.CAMPUS_CENTER_MATCHES)) {
                return 'CC';
            } else if (this.stringContains(buildingString, this.ACADEMIC_CENTER_MATCHES)) {
                return 'AC';
            } else if (this.stringContains(buildingString, this.WEST_HALL_MATCHES)) {
                return 'WH';
            } else if (this.stringContains(buildingString, this.EAST_HALL_MATCHES)) {
                return 'EH';
            }
        }
        // Could not parse building
        return null;
    }

    resolveRoom(roomString) {
        if (roomString && roomString.length > 0) {
            roomString = roomString[0];
            return roomString.trim();
        }
        return null;
    }

    resolveSuffix(suffixString) {
        if (suffixString && suffixString.length > 0) {
            suffixString = suffixString[0];
            // Just return if the regex didn't find anything
            if (suffixString === null || suffixString.length === 0) {
                return null;
            }
            // The regex found something, so let's parse it
            if (this.stringContains(suffixString, this.ANTI_LOUNGE_MATCHES)) {
                return 'AL';
            } else if (this.stringContains(suffixString, this.LOUNGE_MATCHES)) {
                return 'L';
            } else if (this.stringContains(suffixString, this.NOOK_MATCHES)) {
                return 'N';
            }
        }
        return null;
    }

    stringContains(string, substrings) {
        for (let i = 0; i < substrings.length; ++i) {
            if (string.indexOf(substrings[i]) > -1)
                return true;
        }
        return false;
    }

    render() {
        return (
            <div className="row expanded location-field-container">
                <input id="location" type="text" title="Location" className="wide-text-box single-line-text-box medium-text-box" placeholder="Location" onChange={this.textChanged}/>
                <div className="location-parse-result-container">
                    <span className="location-label">Building:</span><span className="location-parsed">{this.state.building}</span>
                    <span className="location-label">Room:</span><span className="location-parsed">{this.state.room}</span>
                    <span className="location-label">Suffix:</span><span className="location-parsed">{this.state.suffix}</span>
                </div>
            </div>
        )
    }

}