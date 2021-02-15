import { getAction } from '../../src';

describe('valueResolver', () => {
  describe('getAction', () => {
    it('should get direct state using string', () => {
      const value = {};
      expect(getAction('hello')(null, { hello: value })).toBe(value);
    });

    it('should get nested state using string', () => {
      const value = {};
      expect(getAction('hello.world')(null, { hello: { world: value } })).toBe(
        value
      );
    });

    it('should get direct state using array', () => {
      const value = {};
      expect(getAction(['hello'])(null, { hello: value })).toBe(value);
    });

    it('should get nested state using string', () => {
      const value = {};
      expect(
        getAction(['hello', 'world'])(null, { hello: { world: value } })
      ).toBe(value);
    });
  });
});
