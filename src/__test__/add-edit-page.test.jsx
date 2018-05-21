import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';
import AddEditEventPage from '../pages/add-edit/add-edit-page';

describe('AddEditEventPage', () => {
  const userAccount = {
    scope: new Map(),
  };
  const adminAccount = {
    scope: new Map(),
  };
  const event = {
    title: 'An event title',
    description: 'some *markdown*',
    labels: ['label'],
    start: moment('2018-05-04T09:00:00Z'),
    end: moment('2018-05-04T10:00:00Z'),
  };
  const sidebarFunctions = {
    setPageTitlePrefix: () => undefined,
    setSidebarMode: () => undefined,
    toggleSidebarCollapsed: () => undefined,
  };

  test('new event', () => {
    const component = renderer.create(<AddEditEventPage
      user={userAccount}
      eventData={null}
      match={{ params: {} }}
      {...sidebarFunctions}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('signed-in user', () => {
    const component = renderer.create(<AddEditEventPage
      user={userAccount}
      eventData={event}
      match={{ params: { id: 1 } }}
      {...sidebarFunctions}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('admin', () => {
    const component = renderer.create(<AddEditEventPage
      user={userAccount}
      eventData={event}
      match={{ params: { id: 1 } }}
      {...sidebarFunctions}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('validateInput', () => {
    const instance = shallow(<AddEditEventPage
      user={adminAccount}
      eventData={event}
      match={{ params: { id: 1 } }}
      possibleLabels={{}}
      {...sidebarFunctions}
    />).instance();
    expect(instance.validateInput()).toBe(false);
    instance.titleChanged({ currentTarget: { value: 'Title' } });
    expect(instance.validateInput()).toBe(false);
    instance.labelToggled('label-1');
    expect(instance.validateInput()).toBe(true);
    instance.saveButtonClicked();
  });
});
