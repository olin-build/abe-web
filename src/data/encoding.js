import _ from 'lodash';
import moment from 'moment';

// Remember which API the server is speaking. This hackey (and won't work if the
// user creates an event in an empty database), but only needs to get us through
// an API transition and can then be removed.
//
// TODO: Remove this variable, and simplify its users, once olinlibrary/ABE#243
// is on production and active developer branches.
let useSnakeCaseProperties = true;

const toLocalDate = date => moment.utc(date).local();

const decodeDateTime = value => (moment.isMoment(value) ? value : toLocalDate(value));

/**
 *  Convert an event from the client-server API format to this app's internal format.
 */
export function decodeEvent(data) {
  useSnakeCaseProperties = 'all_day' in data;
  return _.chain(data)
    .mapKeys((_value, key) => (key === 'all_day' ? 'allDay' : key))
    .mapValues((value, key) => (key === 'start' || key === 'end' ? decodeDateTime(data[key]) : value))
    .value();
}

/**
 *  Convert an event from this app's internal format to the client-server API format.
 */
export function encodeEvent(event) {
  return useSnakeCaseProperties ? _.mapKeys(event, (_value, key) => (key === 'allDay' ? 'all_day' : key)) : event;
}
