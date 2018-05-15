import moment from 'moment';
import React from 'react';
import renderer from 'react-test-renderer';
import RecurrenceSelector from '../pages/add-edit/recurrence-selector';

describe('RecurrenceSelector', () => {
  test('matches daily snapshot', () => {
    const recurrence = { count: 2, frequency: 'DAILY', interval: 1 };
    const jsx = (
      <RecurrenceSelector recurs={recurrence} start={moment('2018-05-12')} onChange={() => {}} />
    );
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('matches weekly snapshot', () => {
    const recurrence = {
      by_day: ['MO'],
      count: 2,
      frequency: 'WEEKLY',
      interval: 1,
    };
    const jsx = (
      <RecurrenceSelector recurs={recurrence} start={moment('2018-05-12')} onChange={() => {}} />
    );
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('matches montly snapshot', () => {
    const recurrence = {
      by_month_day: true,
      count: 2,
      frequency: 'MONTHLY',
      interval: 1,
    };
    const jsx = (
      <RecurrenceSelector recurs={recurrence} start={moment('2018-05-12')} onChange={() => {}} />
    );
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
