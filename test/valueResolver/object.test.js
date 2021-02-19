import { object } from '../../src/valueResolver/object';

describe('valueResolver', () => {
  describe('object', () => {
    it('should resolve static field', () => {
      expect(
        object({
          hello: 'world',
          world: 123
        })()
      ).toEqual({
        hello: 'world',
        world: 123
      });
    });

    it('should resolve dynamic fields', () => {
      const obj = {};

      expect(
        object({
          hello: state => state.value,
          world: (state, action) => action.count,
          test: () => obj
        })(
          {
            value: 'world'
          },
          {
            count: 123
          }
        )
      ).toEqual({
        hello: 'world',
        world: 123,
        test: obj
      });
    });
  });
});
