import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import renderer from 'react-test-renderer';
import PlainEnglishRecurrence, { nth } from '../components/plain-english-recurrence';

describe('nth', () => {
  test('returns the suffix', () => {
    expect(nth(0)).toEqual('th');
    expect(nth(1)).toEqual('st');
    expect(nth(2)).toEqual('nd');
    expect(nth(3)).toEqual('rd');
    expect(nth(4)).toEqual('th');
    expect(nth(10)).toEqual('th');
    expect(nth(11)).toEqual('th');
    expect(nth(21)).toEqual('st');
    expect(nth(31)).toEqual('st');
    expect(nth(91)).toEqual('st');
    expect(nth(101)).toEqual('st');
    expect(nth(102)).toEqual('nd');
  });
});

describe('PlainEnglishRecurrence', () => {
  const getText = (recurrence, start) =>
    shallow(<PlainEnglishRecurrence recurrence={recurrence} start={start} />)
      .text()
      .replace(/\s+/g, ' ');

  test('matches snapshot', () => {
    const recurrence = { count: 2, interval: 1, frequency: 'DAILY' };
    const component = renderer.create(<PlainEnglishRecurrence recurrence={recurrence} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('daily', () => {
    let recurrence = { count: 1, interval: 1, frequency: 'DAILY' };
    expect(getText(recurrence)).toEqual('Repeats daily 1 times');

    recurrence = { count: 2, interval: 1, frequency: 'DAILY' };
    expect(getText(recurrence)).toEqual('Repeats daily 2 times');

    recurrence = { count: 2, interval: 1, frequency: 'DAILY' };
    expect(getText(recurrence)).toEqual('Repeats daily 2 times');

    recurrence = { count: 2, interval: 2, frequency: 'DAILY' };
    expect(getText(recurrence)).toEqual('Repeats every 2 days 2 times');

    recurrence = { interval: 1, frequency: 'DAILY', until: moment('2018-07-01') };
    expect(getText(recurrence)).toEqual('Repeats daily until Sun, Jul 1, 2018');

    recurrence = { interval: 2, frequency: 'DAILY', until: moment('2018-07-01') };
    expect(getText(recurrence)).toEqual('Repeats every 2 days until Sun, Jul 1, 2018');
  });
  test('weekly', () => {
    let recurrence = {
      by_day: ['MO'],
      count: 2,
      interval: 1,
      frequency: 'WEEKLY',
    };
    expect(getText(recurrence)).toEqual('Repeats weekly on Mon 2 times');

    recurrence = {
      by_day: ['MO', 'WE'],
      count: 2,
      interval: 1,
      frequency: 'WEEKLY',
    };
    expect(getText(recurrence)).toEqual('Repeats weekly on Mon and Wed 2 times');

    recurrence = {
      by_day: ['MO', 'WE', 'FR'],
      count: 2,
      interval: 1,
      frequency: 'WEEKLY',
    };
    expect(getText(recurrence)).toEqual('Repeats weekly on Mon, Wed and Fri 2 times');

    recurrence = {
      by_day: ['MO', 'WE'],
      interval: 1,
      frequency: 'YEARLY',
      until: moment('2018-07-01'),
    };
    expect(getText(recurrence)).toEqual('Repeats yearly until Sun, Jul 1, 2018');
  });
  test('monthly', () => {
    let recurrence = {
      by_day: ['MO'],
      count: 2,
      frequency: 'MONTHLY',
      interval: 1,
    };
    let text = getText(recurrence, moment('2018-05-11'));
    expect(text).toEqual('Repeats monthly on the 2nd Mon of the month 2 times');

    recurrence = {
      count: 2,
      frequency: 'MONTHLY',
      interval: 1,
    };
    text = getText(recurrence, moment('2018-05-11'));
    expect(text).toEqual('Repeats monthly on the 11th day of the month 2 times');

    recurrence = {
      frequency: 'MONTHLY',
      interval: 1,
      until: moment('2018-07-01'),
    };
    text = getText(recurrence, moment('2018-05-11'));
    expect(text).toEqual('Repeats monthly on the 11th day of the month until Sun, Jul 1, 2018');
  });
  test('yearly', () => {
    let recurrence = { count: 2, interval: 1, frequency: 'YEARLY' };
    expect(getText(recurrence)).toEqual('Repeats yearly 2 times');

    recurrence = { interval: 1, frequency: 'YEARLY', until: moment('2018-07-01') };
    expect(getText(recurrence)).toEqual('Repeats yearly until Sun, Jul 1, 2018');
  });
});
