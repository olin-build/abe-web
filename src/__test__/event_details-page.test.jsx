import moment from 'moment';
import React from 'react';
import renderer from 'react-test-renderer';
import EventDetailsPage from '../pages/details/event-details-page';

describe('EventDetailsPage', () => {
  test('loading', () => {
    const component = renderer.create(<EventDetailsPage eventData={null} setSidebarMode={() => undefined} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('regular event', () => {
    const event = {
      title: 'Title',
      location: 'Location',
      description: 'Description',
      start: moment('2018-05-07T09:00:00-04:00'),
      end: moment('2018-05-07T10:00:00-04:00'),
      allDay: false,
    };
    const component = renderer.create(<EventDetailsPage eventData={event} setSidebarMode={() => undefined} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('single-day all-day event', () => {
    const event = {
      title: 'Title',
      location: 'Location',
      description: 'Description',
      start: moment('2018-05-07T00:00:00-04:00'),
      end: moment('2018-05-07T23:59:59-04:00'),
      allDay: true,
    };
    const component = renderer.create(<EventDetailsPage eventData={event} setSidebarMode={() => undefined} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('multi-day all-day event', () => {
    const event = {
      title: 'Title',
      location: 'Location',
      description: 'Description',
      start: moment('2018-05-07T00:00:00-04:00'),
      end: moment('2018-05-08T23:59:59-04:00'),
      allDay: true,
    };
    const component = renderer.create(<EventDetailsPage eventData={event} setSidebarMode={() => undefined} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
