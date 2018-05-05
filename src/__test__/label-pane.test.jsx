import React from 'react';
import renderer from 'react-test-renderer';
import LabelPane from '../components/label-pane';

describe('LabelPane', () => {
  const labels = {
    first: {
      name: 'first',
      id: 'label-1',
      color: 'red',
      description: 'first label',
    },
    second: {
      name: 'second',
      id: 'label-2',
      color: 'green',
      description: 'second label',
    },
  };
  test('matches snapshot', () => {
    const component = renderer.create(<LabelPane contentClass="css-class" possibleLabels={labels} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('with selected labels', () => {
    const component = renderer.create(<LabelPane contentClass="css-class" possibleLabels={labels} selectedLabels={['first']} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('not editable', () => {
    const component = renderer.create(<LabelPane contentClass="css-class" editable={false} possibleLabels={labels} selectedLabels={['first']} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('sorts labels', () => {
    const labels2 = {
      0: { name: 'featured' },
      1: { name: 'a-label-2' },
      2: { name: 'a-label-1' },
      3: { name: 'a-label-4', default: true },
      4: { name: 'a-label-3', default: true },
    };
    // These should come out in order 'featured', 'a-label-3', 'a-label-4', 'a-label-1', a-label-2'.
    // Initially verified from manual inspection of the snapshot.
    Object.values(labels2).forEach((label, ix) => {
      label.id = `id-${ix}`; // eslint-disable-line no-param-reassign
    });
    const component = renderer.create(<LabelPane possibleLabels={labels2} showUnselected />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
