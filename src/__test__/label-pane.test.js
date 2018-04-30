import React from 'react';
import renderer from 'react-test-renderer';
import LabelPane from '../components/label-pane';

describe('LabelPane', () => {
  const labels = {
    first: {color: 'red', description: 'first label'},
    second: {color: 'green', description: 'second label'},
  };
  test('matches snapshot', () => {
    const component = renderer.create(<LabelPane
      contentClass="css-class"
      possibleLabels={labels}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('with selected labels', () => {
    const component = renderer.create(<LabelPane
      contentClass="css-class"
      possibleLabels={labels}
      selectedLabels={['first']}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('not editable', () => {
    const component = renderer.create(<LabelPane
      contentClass="css-class"
      editable={false}
      possibleLabels={labels}
      selectedLabels={['first']}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
