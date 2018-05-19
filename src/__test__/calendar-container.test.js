import { getVisibleEvents } from '../containers/calendar-container';

describe('getVisibleEvents', () => {
  const events = [
    { name: 'A', id: 1, labels: ['a'] },
    { name: 'B', id: 2, labels: ['b'] },
    { name: 'C', sid: 3, labels: ['a', 'b'] },
  ];
  const allLabels = {
    a: { color: 'red' },
    b: { color: 'green' },
    c: { color: 'blue' },
  };
  const labels = Object.keys(allLabels);
  test('waits for data', () => {
    expect(getVisibleEvents(null, labels, allLabels)).toEqual(null);
    expect(getVisibleEvents(events, null, allLabels)).toEqual(null);
    expect(getVisibleEvents(events, labels, null)).toEqual(null);
  });
  test('assigns ids', () => {
    const es = getVisibleEvents(events, labels, allLabels);
    expect(es[0].id).toEqual(1);
    expect(es[1].id).toEqual(2);
    expect(es[2].id).toEqual(3);
  });
  test('assigns color', () => {
    const es = getVisibleEvents(events, labels, allLabels);
    expect(es[0].color).toEqual('red');
    expect(es[1].color).toEqual('green');
    expect(es[2].color).toEqual('red');
  });
  test('filters labels', () => {
    const es1 = getVisibleEvents(events, ['a'], allLabels);
    expect(es1.length).toEqual(2);
    expect(es1[0].id).toEqual(1);
    expect(es1[1].id).toEqual(3);

    const es2 = getVisibleEvents(events, ['b'], allLabels);
    expect(es2.length).toEqual(2);
    expect(es2[0].id).toEqual(2);
    expect(es2[1].id).toEqual(3);
  });
});

describe('getVisibleEvents', () => {
  const events = [
    { name: 'A', id: 1, labels: ['a'] },
    { name: 'B', id: 2, labels: ['b'] },
    { name: 'C', sid: 3, labels: ['a', 'b'] },
  ];
  const allLabels = {
    a: { color: 'red' },
    b: { color: 'green' },
    c: { color: 'blue' },
  };
  const labels = Object.keys(allLabels);
  test('waits for data', () => {
    expect(getVisibleEvents(null, labels, allLabels)).toEqual(null);
    expect(getVisibleEvents(events, null, allLabels)).toEqual(null);
    expect(getVisibleEvents(events, labels, null)).toEqual(null);
  });
  test('assigns ids', () => {
    const es = getVisibleEvents(events, labels, allLabels);
    expect(es[0].id).toEqual(1);
    expect(es[1].id).toEqual(2);
    expect(es[2].id).toEqual(3);
  });
  test('assigns color', () => {
    const es = getVisibleEvents(events, labels, allLabels);
    expect(es[0].color).toEqual('red');
    expect(es[1].color).toEqual('green');
    expect(es[2].color).toEqual('red');
  });
  test('filters labels', () => {
    const es1 = getVisibleEvents(events, ['a'], allLabels);
    expect(es1.length).toEqual(2);
    expect(es1[0].id).toEqual(1);
    expect(es1[1].id).toEqual(3);

    const es2 = getVisibleEvents(events, ['b'], allLabels);
    expect(es2.length).toEqual(2);
    expect(es2[0].id).toEqual(2);
    expect(es2[1].id).toEqual(3);
  });
});
