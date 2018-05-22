import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';
import Sidebar from '../sidebar/sidebar';

jest.mock('../components/label-pane', () => props => (
  <div className="label-pane">{props.selectedLabels.join(' ')}</div>
));
jest.mock('../components/sidebar-header', () => () => <div className="sidebar-header" />);
jest.mock('../sidebar/footer', () => () => <div className="footer" />);

describe('Sidebar', () => {
  const user = {
    scope: new Set(['create:events', 'edit:events', 'read:all_events']),
  };
  const signedOutUser = {
    scope: new Set(),
  };
  const event = {
    title: 'An event title',
    description: 'some *markdown*',
    labels: ['label'],
    start: moment('2018-05-04T09:00:00Z'),
    end: moment('2018-05-04T10:00:00Z'),
  };
  const props = {
    currentEvent: event,
    isCollapsed: false,
    possibleLabels: { featured: { name: 'featured' } },
    selectedLabels: ['featured'],
    user,
  };
  const handlers = {
    addEvent: () => undefined,
    deleteCurrentEvent: () => undefined,
    editCurrentEvent: () => undefined,
    editEventSeries: () => undefined,
    homeClicked: () => undefined,
    icsUrlCopiedToClipboard: () => undefined,
    importICSClicked: () => undefined,
    labelToggled: () => undefined,
    setVisibleLabels: () => undefined,
    toggleSidebarCollapsed: () => undefined,
  };

  test('renders event actions', () => {
    const jsx = <Sidebar sidebarMode={{ EVENT_ACTIONS: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders event labels', () => {
    const jsx = <Sidebar sidebarMode={{ EVENT_LABELS_PANE: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders filter pane', () => {
    const jsx = <Sidebar sidebarMode={{ FILTER_PANE: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders ICS pane', () => {
    const jsx = <Sidebar sidebarMode={{ GENERATE_ICS_PANE: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders link pane', () => {
    const jsx = <Sidebar sidebarMode={{ LINK_PANE: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders markdown pane', () => {
    const jsx = <Sidebar sidebarMode={{ MARKDOWN_GUIDE: true }} {...handlers} {...props} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders sign in', () => {
    const jsx = <Sidebar sidebarMode={{}} {...handlers} {...props} user={signedOutUser} />;
    const component = renderer.create(jsx);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
