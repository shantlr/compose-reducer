import { gte } from '../../src';

describe('valueResolver', () => {
  describe('gte', () => {
    it('should compute truthy greater than', () => {
      expect(gte(2, 1)()).toBe(true);
      expect(gte(2, 2)()).toBe(true);
      expect(
        gte(
          () => 2,
          () => 1
        )()
      ).toBe(true);
      expect(
        gte(
          state => state,
          (state, action) => action
        )(3, 2)
      ).toBe(true);
    });

    it('should compute falsy greather than', () => {
      expect(gte(1, 2)()).toBe(false);
      expect(
        gte(
          () => 1,
          () => 2
        )()
      ).toBe(false);
    });
  });
});
