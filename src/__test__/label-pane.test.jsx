import React from 'react';
import renderer from 'react-test-renderer';
import LabelPane from '../components/label-pane';

describe('LabelPane', () => {
  const labels = {
    first: { id: 'label-1', color: 'red', description: 'first label' },
    second: { id: 'label-2', color: 'green', description: 'second label' },
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
});
