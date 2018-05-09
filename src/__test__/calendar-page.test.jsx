import { normalizeUrlLabels } from '../pages/calendar/calendar-page';

describe('normalizeUrlLabels', () => {
  test('matches label case', () => {
    const allLabels = { featured: {}, 'final events': {}, StAR: {} };
    expect(normalizeUrlLabels('featured', allLabels)).toEqual(['featured']);
    expect(normalizeUrlLabels('Featured', allLabels)).toEqual(['featured']);
    expect(normalizeUrlLabels('star', allLabels)).toEqual(['StAR']);
    expect(normalizeUrlLabels('final events', allLabels)).toEqual(['final events']);
    expect(normalizeUrlLabels('final-events', allLabels)).toEqual(['final events']);
    expect(normalizeUrlLabels('Final Events', allLabels)).toEqual(['final events']);
  });
  test('sorts by name', () => {
    const allLabels = { c: {}, b: {}, a: {} };
    expect(normalizeUrlLabels('C,b,A', allLabels)).toEqual(['a', 'b', 'c']);
  });
});
