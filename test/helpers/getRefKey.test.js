import { getRefKey } from '../../src/helpers/ensureNewRef';

describe('helpers', () => {
  describe('getRefKey', () => {
    it('should compute root refKey', () => {
      expect(getRefKey([])).toBe('');
      expect(getRefKey()).toBe('');
      expect(getRefKey('')).toBe('');
      expect(getRefKey(null)).toBe('');
      expect(getRefKey(undefined)).toBe('');
    });
  });
});
