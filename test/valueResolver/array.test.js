const { getState, getAction } = require('../../src');
const { array } = require('../../src/valueResolver/array');

describe('valueResolver', () => {
  describe('array', () => {
    it('should resolve static field', () => {
      expect(array('parent', 'child', 1)()).toEqual(['parent', 'child', 1]);
    });

    it('should resolve dynamic fields', () => {
      expect(
        array(
          'parent',
          getState('value'),
          getAction('count')
        )(
          {
            value: 'world'
          },
          {
            count: 123
          }
        )
      ).toEqual(['parent', 'world', 123]);
    });
  });
});
