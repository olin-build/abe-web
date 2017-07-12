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

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value})
    }

    textChanged() {
        let locationField = $('#location');
        let value = locationField.val();
        let parsed = this.tryParseLocationInput(value);
        let locationObj = {
            building: parsed.building,
            room: parsed.room,
            suffix: parsed.suffix,
            value: value
        };
        this.setState(locationObj);
        if (parsed.isValid) {
            locationField.removeClass('is-invalid-input');
        } else {
            locationField.addClass('is-invalid-input');
        }
        if (this.props.onChange) {
            this.props.onChange(locationObj);
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

            if (this.stringMatches(buildingString, this.MILAS_HALL_MATCHES)) {
                return 'MH';
            } else if (this.stringMatches(buildingString, this.CAMPUS_CENTER_MATCHES)) {
                return 'CC';
            } else if (this.stringMatches(buildingString, this.ACADEMIC_CENTER_MATCHES)) {
                return 'AC';
            } else if (this.stringMatches(buildingString, this.WEST_HALL_MATCHES)) {
                return 'WH';
            } else if (this.stringMatches(buildingString, this.EAST_HALL_MATCHES)) {
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
            if (this.stringMatches(suffixString, this.ANTELOUNGE_MATCHES)) {
                return 'AL';
            } else if (this.stringMatches(suffixString, this.LOUNGE_MATCHES)) {
                return 'L';
            } else if (this.stringMatches(suffixString, this.NOOK_MATCHES)) {
                return 'N';
            } else if (this.stringMatches(suffixString, this.SUITE_MATCHES)) {
                return suffixString.toUpperCase();
            } else if (this.stringMatches(suffixString, this.MISC_ROOM_MATCHES)) {
                return suffixString.toUpperCase();
            }
        }
        return null;
    }

    stringMatches(string, substrings) {
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
                <input id="location" type="text" title="Location" className="wide-text-box single-line-text-box medium-text-box" placeholder="Location" value={this.props.location.value} onChange={this.textChanged}/>
                <div className="location-parse-result-container">
                    <span className="location-label">Building:</span><span className="location-parsed">{this.props.location.building}</span>
                    <span className="location-label">Room:</span><span className="location-parsed">{this.props.location.room}</span>
                    <span className="location-label">Suffix:</span><span className="location-parsed">{this.props.location.suffix}</span>
                </div>
            </div>
        )
    }

}
