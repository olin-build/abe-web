import moment from 'moment';
import { decodeEvent, encodeEvent } from '../data/encoding';

describe('decodeEvent', () => {
  test('decodes dates', () => {
    const event = decodeEvent({ start: '2018-05-07T09:00:00Z', end: '2018-05-07T10:00:00Z' });
    expect(event.start).toBeInstanceOf(moment);
    expect(event.start.format()).toBe('2018-05-07T05:00:00-04:00');
    expect(event.end).toBeInstanceOf(moment);
  });
  test('renames all_day property', () => {
    const event = decodeEvent({ all_day: true });
    expect(event).not.toHaveProperty('all_day');
    expect(event).toHaveProperty('allDay');
    expect(event.allDay).toBe(true);
  });
});

describe('encodeEvent', () => {
  test.skip('renames allDay', () => {
    // TODO: enable this, and remove the next two tests, once the decodeEvent no
    // longer has side effects.
    const event = encodeEvent({ allDay: true });
    expect(event).toHaveProperty('all_day');
    expect(event).not.toHaveProperty('allDay');
    expect(event.all_day).toBe(true);
  });
  test('renames allDay on evidence of the new API', () => {
    decodeEvent({ all_day: true }); // for effect
    const event = encodeEvent({ allDay: true });
    expect(event).toHaveProperty('all_day');
    expect(event).not.toHaveProperty('allDay');
  });
  test('does not rename allDay on evidence of the old API', () => {
    decodeEvent({ allDay: true }); // for effect
    const event = encodeEvent({ allDay: true });
    expect(event).not.toHaveProperty('all_day');
    expect(event).toHaveProperty('allDay');
  });
});
