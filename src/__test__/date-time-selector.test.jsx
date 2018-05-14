import React from 'react';
import moment from 'moment';
import renderer from 'react-test-renderer';
import DateTimeSelector from '../components/date-time-selector';

describe('DateTimeSelector', () => {
  test('datetime', () => {
    const jsx = (
      <DateTimeSelector datetime={moment('2018-05-14T12:00:00Z')} onChange={() => undefined} />
    );
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('date', () => {
    const jsx = (
      <DateTimeSelector
        datetime={moment('2018-05-14T12:00:00Z')}
        show="date"
        onChange={() => undefined}
      />
    );
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
