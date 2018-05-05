import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';
import AddEditEventPage from '../pages/add-edit/add-edit-page';

describe('AddEditEventPage', () => {
  // TODO: test the snapshot. This requires mocking moment or
  // EventDateTimeSelector, or modifying the latter to accept the datetime as
  // a property.
  test.skip('matches snapshot', () => {
    const event = {
      title: 'An event title',
      labels: ['label'],
      start: moment('2018-05-04T09:00:00Z'),
      end: moment('2018-05-04T10:00:00Z'),
    };
    const component = renderer.create(<AddEditEventPage
      eventData={event}
      match={{ params: { id: 1 } }}
      setPageTitlePrefix={() => undefined}
      setSidebarMode={() => undefined}
      toggleSidebarCollapsed={() => undefined}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('validateInput', () => {
    const event = {
      title: 'An event title',
      labels: [''],
      start: moment('2018-05-04T09:00:00Z'),
      end: moment('2018-05-04T10:00:00Z'),
    };
    const wrapper = shallow(<AddEditEventPage
      eventData={event}
      match={{ params: { id: 1 } }}
      possibleLabels={{}}
      setPageTitlePrefix={() => undefined}
      setSidebarMode={() => undefined}
      toggleSidebarCollapsed={() => undefined}
    />);
    expect(wrapper.instance().validateInput()).toBe(false);
    wrapper.instance().titleChanged({ currentTarget: { value: 'Title' } });
    expect(wrapper.instance().validateInput()).toBe(false);
    wrapper.instance().labelToggled('label-1');
    expect(wrapper.instance().validateInput()).toBe(true);
  });
});
