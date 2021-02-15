import { getState } from '../../src';

describe('valueResolver', () => {
  describe('getState', () => {
    it('should get direct state using string', () => {
      const value = {};
      expect(getState('hello')({ hello: value })).toBe(value);
    });

    it('should get nested state using string', () => {
      const value = {};
      expect(getState('hello.world')({ hello: { world: value } })).toBe(value);
    });

    it('should get direct state using array', () => {
      const value = {};
      expect(getState(['hello'])({ hello: value })).toBe(value);
    });

    it('should get nested state using string', () => {
      const value = {};
      expect(getState(['hello', 'world'])({ hello: { world: value } })).toBe(
        value
      );
    });
  });
});
