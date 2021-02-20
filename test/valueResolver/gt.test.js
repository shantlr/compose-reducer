import { gt } from '../../src';

describe('valueResolver', () => {
  describe('gt', () => {
    it('should compute truthy greater than', () => {
      expect(gt(2, 1)()).toBe(true);
      expect(
        gt(
          () => 2,
          () => 1
        )()
      ).toBe(true);
      expect(
        gt(
          state => state,
          (state, action) => action
        )(3, 2)
      ).toBe(true);
    });

    it('should compute falsy greather than', () => {
      expect(gt(1, 2)()).toBe(false);
      expect(
        gt(
          () => 1,
          () => 2
        )()
      ).toBe(false);
      expect(
        gt(
          () => 1,
          () => 1
        )()
      ).toBe(false);
    });
  });
});
