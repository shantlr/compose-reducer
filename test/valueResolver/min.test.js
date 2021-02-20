import { min } from '../../src';

describe('valueResolver', () => {
  describe('min', () => {
    it('should resolve static min value', () => {
      expect(min(0, 12, -10)()).toBe(-10);
    });
    it('should resolve dynamic min value', () => {
      expect(min(0, 12, -10, () => -22)()).toBe(-22);
      expect(min(0, 12, -10, state => state)(-23)).toBe(-23);
      expect(min(0, 12, -10, (state, action) => action)(-23, -24)).toBe(-24);
    });
  });
});
