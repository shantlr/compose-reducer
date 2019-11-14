import { isString } from '../../src/utils/isString';

describe('utils', () => {
  describe('isString', () => {
    it('should return true when value is a string', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello world')).toBe(true);
    });

    it('should return false when valus is not a string', () => {
      expect(isString()).toBe(false);
      expect(isString(0)).toBe(false);
      expect(isString(123)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(false)).toBe(false);
    });
  });
});
