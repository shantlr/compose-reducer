import { isNil } from '../../src/utils/isNil';

describe('utils', () => {
  describe('isNil', () => {
    it('should return true on null', () => {
      expect(isNil(null)).toBe(true);
    });
    it('should return true on undefined', () => {
      expect(isNil(undefined)).toBe(true);
    });
    it('should return false on 0', () => {
      expect(isNil(0)).toBe(false);
    });
    it('should return false on false', () => {
      expect(isNil(false)).toBe(false);
    });
    it("should return false on '0'", () => {
      expect(isNil('0')).toBe(false);
    });
    it('should return false on empty string', () => {
      expect(isNil('')).toBe(false);
    });
    it('should return false on object', () => {
      expect(isNil({})).toBe(false);
    });
  });
});
