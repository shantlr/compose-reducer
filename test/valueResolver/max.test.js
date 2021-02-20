import { max } from '../../src';

describe('valueResolver', () => {
  describe('max', () => {
    it('should resolve static max value', () => {
      expect(max(0, 12, -10)()).toBe(12);
    });
    it('should resolve dynamic max value', () => {
      expect(max(0, 12, -10, () => 22)()).toBe(22);
      expect(max(0, 12, -10, state => state)(23)).toBe(23);
      expect(max(0, 12, -10, (state, action) => action)(23, 24)).toBe(24);
    });
  });
});
