import * as React from "react";

export default class LocationField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.tryParseLocationInput = this.tryParseLocationInput.bind(this);
        this.resolveBuilding = this.resolveBuilding.bind(this);
        this.textChanged = this.textChanged.bind(this);

        // Matching substrings for each building. Should be lowercase.
        this.MILAS_HALL_MATCHES = ['mh', 'milas', 'milas hall', 'milashall'];
        this.CAMPUS_CENTER_MATCHES = ['cc', 'campus center', 'campuscenter'];
        this.ACADEMIC_CENTER_MATCHES = ['ac', 'academic center', 'academiccenter'];
        this.WEST_HALL_MATCHES = ['wh', 'west hall', 'westhall'];
        this.EAST_HALL_MATCHES = ['eh', 'east hall', 'easthall'];
        this.LOUNGE_MATCHES = ['l', 'lounge'];
        this.ANTELOUNGE_MATCHES = ['al', 'antelounge', 'antelounge', 'antilounge', 'anti-lounge'];
        this.NOOK_MATCHES = ['n', 'nook'];
        this.SUITE_MATCHES = ['nn', 'nw', 'ne', 'w', 'e'];
        this.MISC_ROOM_MATCHES = ['gym', 'kitchen'];
    }

    textChanged() {
        let locationField = $('#location');
        let res = this.tryParseLocationInput(locationField.val());
        this.setState({
            building: res.building,
            room: res.room,
            suffix: res.suffix
        });
        if (res.isValid) {
            locationField.removeClass('is-invalid-input');
            if (this.props.onChange) {
                this.props.onChange(res.building+res.room+res.suffix);
            }
        } else {
            locationField.addClass('is-invalid-input');
            if (this.props.onChange) {
                this.props.onChange(null);
            }
        }
    }

    tryParseLocationInput(string) {
        if (string.length === 0)
            return {isValid: true};

        string = string.toLowerCase();
        let buildingRegex = /^\D+/;
        let roomRegex = /\d+/;
        let suffixRegex = /\D*$/;
        let building = this.resolveBuilding(buildingRegex.exec(string));
        let room = this.resolveRoom(roomRegex.exec(string));
        let suffix = this.resolveSuffix(suffixRegex.exec(string)); // TODO Handle kitchen, gym, etc
        let isValid = (building !== null && room !== null && suffix !== null);

        return {isValid: isValid, building: building, room: room, suffix: suffix};
    }

    resolveBuilding(buildingString) {

        if (buildingString && buildingString.length > 0) {
            buildingString = buildingString[0].trim();

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
                return '';
            }
            // The regex found something, so let's parse it
            if (this.stringContains(suffixString, this.ANTELOUNGE_MATCHES)) {
                return 'AL';
            } else if (this.stringContains(suffixString, this.LOUNGE_MATCHES)) {
                return 'L';
            } else if (this.stringContains(suffixString, this.NOOK_MATCHES)) {
                return 'N';
            } else if (this.stringContains(suffixString, this.SUITE_MATCHES)) {
                return suffixString.toUpperCase();
            } else if (this.stringContains(suffixString, this.MISC_ROOM_MATCHES)) {
                return suffixString.toUpperCase();
            }
        }
        return null;
    }

    stringContains(string, substrings) {
        string = string.trim();
        for (let i = 0; i < substrings.length; ++i) {
            if (string === substrings[i])
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
