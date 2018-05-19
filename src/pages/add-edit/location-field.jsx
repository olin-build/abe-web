// This component is a text box for event locations. It tries to parse locations
// on the Olin campus (input in various formats) and stores them in a standard
// format to aid in analytics later.

import * as React from 'react';

export default class LocationField extends React.Component {
  static stringMatches(str, substrings) {
    const s = str.trim();
    return substrings.some(substr => substr === s);
  }

  constructor(props) {
    super(props);
    this.state = {
      building: null,
      room: null,
      suffix: null,
      isOlin: false,
    };

    // Matching substrings for each building. Should be lowercase.
    // Could be done better
    this.O_MATCHES = ['o', 'the o', 'oval', 'the oval'];
    this.LIBRARY_MATCHES = ['library', 'lib', 'l'];
    this.LIBRARY_UPPER_LEVEL_MATCHES = ['library upper level', 'lu', 'lul', 'library ul'];
    this.LIBRARY_LOWER_LEVEL_MATCHES = ['library lower level', 'll', 'lll', 'library ll'];
    this.AUDITORIUM_MATCHES = [
      'auditorium',
      'nordatorium',
      'nord',
      'mh auditorium',
      'milas hall auditorium',
      'milas auditorium',
      'mh nord',
      'mh nordatorium',
    ];
    this.DINING_HALL_MATCHES = ['dh', 'dining hall'];
    this.DINING_HALL_MEZZANINE_MATCHES = [
      'dh mezz',
      'dhm',
      'mezz',
      'dining hall mezz',
      'dining hall mezzanine',
      'cc mezz',
      'campus center mezz',
      'campus center mezzanine',
    ];
    this.MILAS_HALL_MEZZANINE_MATCHES = [
      'mh mezz',
      'mhm',
      'milas mezz',
      'milas hall mezz',
      'milas hall mezz',
      'milas hall mezzanine',
    ];
    this.GREAT_LAWN_MATCHES = ['gl', 'great lawn', 'lawn'];
    this.MILAS_HALL_MATCHES = ['mh', 'milas', 'milas hall'];
    this.CAMPUS_CENTER_MATCHES = ['cc', 'campus center'];
    this.ACADEMIC_CENTER_MATCHES = ['ac', 'academic center'];
    this.WEST_HALL_MATCHES = ['wh', 'west hall'];
    this.EAST_HALL_MATCHES = ['eh', 'east hall'];
    this.LOUNGE_MATCHES = ['l', 'lounge'];
    this.ANTELOUNGE_MATCHES = ['al', 'antelounge', 'antelounge', 'antilounge', 'anti-lounge'];
    // this.NOOK_MATCHES = ['n', 'nook'];
    this.SUITE_MATCHES = ['n', 'nn', 'nw', 'ne', 'w', 'e'];
    this.WEST_HALL_KITCHEN_MATCHES = ['whk', 'west hall kitchen', 'wh kitchen'];
    this.EAST_HALL_KITCHEN_MATCHES = ['ehk', 'east hall kitchen', 'eh kitchen'];
    this.WEST_HALL_GYM_MATCHES = ['whg', 'west hall gym', 'wh gym'];
    this.EAST_HALL_GYM_MATCHES = ['ehg', 'east hall gym', 'eh gym'];
    this.LARGE_PROJECT_BUILDING_MATCHES = ['lpb', 'large project building'];
    this.CRESCENT_ROOM = ['crescent', 'crescent room', 'cr'];
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.location;
    const parsed = this.tryParseLocationInput(value);
    const locationObj = {
      building: parsed.building,
      room: parsed.room,
      suffix: parsed.suffix,
      isOlin: parsed.isOlin,
      value,
    };
    this.setState(locationObj);
  }

  textChanged = (e) => {
    const { value } = e.target;
    const parsed = this.tryParseLocationInput(value);
    const locationObj = {
      building: parsed.building,
      room: parsed.room,
      suffix: parsed.suffix,
      isOlin: parsed.isOlin,
      value,
    };
    if (this.props.onChange) {
      this.props.onChange(locationObj);
    }
  };

  tryParseLocationInput = (str) => {
    let name = str;
    const result = { isOlin: false, building: null, room: null };

    if (name && name.length > 0) {
      // We don't care about case
      name = name.toLowerCase();

      // Define regular expressions to use when searching string
      const buildingRegex = /^\D+/;
      const roomRegex = /\d+/;
      const suffixRegex = /\D*$/;

      // Try to determine Olin building
      let buildingString = buildingRegex.exec(name);
      if (buildingString && buildingString.length > 0) {
        buildingString = buildingString[0].trim();

        if (LocationField.stringMatches(buildingString, this.MILAS_HALL_MATCHES)) {
          result.building = 'MH';
        } else if (LocationField.stringMatches(buildingString, this.CAMPUS_CENTER_MATCHES)) {
          result.building = 'CC';
        } else if (LocationField.stringMatches(buildingString, this.ACADEMIC_CENTER_MATCHES)) {
          result.building = 'AC';
        } else if (LocationField.stringMatches(buildingString, this.WEST_HALL_MATCHES)) {
          result.building = 'WH';
        } else if (LocationField.stringMatches(buildingString, this.EAST_HALL_MATCHES)) {
          result.building = 'EH';
        } else if (LocationField.stringMatches(buildingString, this.WEST_HALL_KITCHEN_MATCHES)) {
          result.building = 'WH';
          result.room = 'Kitchen';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.EAST_HALL_KITCHEN_MATCHES)) {
          result.building = 'EH';
          result.room = 'Kitchen';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.WEST_HALL_GYM_MATCHES)) {
          result.building = 'WH';
          result.room = 'Gym';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.EAST_HALL_GYM_MATCHES)) {
          result.building = 'EH';
          result.room = 'Gym';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.LIBRARY_MATCHES)) {
          result.building = 'MH';
          result.room = 'Library';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.LIBRARY_UPPER_LEVEL_MATCHES)) {
          result.building = 'MH';
          result.room = 'Library';
          result.suffix = 'UL';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.LIBRARY_LOWER_LEVEL_MATCHES)) {
          result.building = 'MH';
          result.room = 'Library';
          result.suffix = 'LL';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.AUDITORIUM_MATCHES)) {
          result.building = 'MH';
          result.room = 'Auditorium';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.O_MATCHES)) {
          result.room = 'O';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.GREAT_LAWN_MATCHES)) {
          result.room = 'Great Lawn';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.DINING_HALL_MATCHES)) {
          result.building = 'CC';
          result.room = 'Dining Hall';
        } else if (
          LocationField.stringMatches(buildingString, this.DINING_HALL_MEZZANINE_MATCHES)
        ) {
          result.building = 'CC';
          result.room = 'Dining Hall';
          result.suffix = 'Mezzanine';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.MILAS_HALL_MEZZANINE_MATCHES)) {
          result.building = 'MH';
          result.suffix = 'Mezzanine';
          result.isOlin = true;
          return result;
        } else if (
          LocationField.stringMatches(buildingString, this.LARGE_PROJECT_BUILDING_MATCHES)
        ) {
          result.building = 'LPB';
          result.isOlin = true;
          return result;
        } else if (LocationField.stringMatches(buildingString, this.CRESCENT_ROOM)) {
          result.building = 'CC';
          result.room = 'Crescent Room';
          result.isOlin = true;
          return result;
        }
      }

      // Try to determine Olin room number
      const roomString = roomRegex.exec(name);
      if (roomString && roomString.length > 0) {
        result.room = roomString[0].trim();
      }

      // Try to determine Olin room suffix (optional)
      const suffixMatch = suffixRegex.exec(name);
      if (suffixMatch && suffixMatch.length > 0) {
        const suffixString = suffixMatch[0];
        // Just return if the regex didn't find anything
        if (suffixString !== null && suffixString.length > 0) {
          // The regex found something, so let's parse it
          if (LocationField.stringMatches(suffixString, this.ANTELOUNGE_MATCHES)) {
            result.suffix = 'AL';
          } else if (LocationField.stringMatches(suffixString, this.LOUNGE_MATCHES)) {
            result.suffix = 'L';
            // } else if (LocationField.stringMatches(suffixString, this.NOOK_MATCHES)) {
            //     result.suffix = 'N';
          } else if (LocationField.stringMatches(suffixString, this.SUITE_MATCHES)) {
            result.suffix = suffixString.toUpperCase();
          }
        } else {
          result.suffix = null;
        }
      }

      result.isOlin =
        result.building !== null && result.room !== null && result.suffix !== undefined;
    }
    return result;
  };

  render() {
    // let svgSrc = (this.state.isOlin) ? '/assets/olin-o.svg' : '/assets/olin-o-slash.svg';
    // let oTooltip = (this.state.isOlin) ? 'Recognized Olin location' : 'Location not at Olin';
    return (
      <div className="location-field-container">
        <div className="location-input-container">
          <input
            id="location"
            type="text"
            title="Location"
            className="wide-text-box single-line-text-box medium-text-box"
            placeholder="Location"
            value={this.props.location}
            onChange={this.textChanged}
          />
          <span hidden={!this.state.isOlin} title="Building" className="location-parsed">
            {this.state.building}
          </span>
          <span hidden={!this.state.isOlin} title="Room" className="location-parsed">
            {this.state.room}
          </span>
          <span
            hidden={!this.state.isOlin || !this.state.suffix}
            title="Suffix"
            className="location-parsed"
          >
            {this.state.suffix}
          </span>
        </div>
      </div>
    );
  }
}
