import { lte } from '../../src';

describe('valueResolver', () => {
  describe('lte', () => {
    it('should compute truthy lesser or equal than', () => {
      expect(lte(1, 2)()).toBe(true);
      expect(lte(2, 2)()).toBe(true);
      expect(
        lte(
          () => 1,
          () => 2
        )()
      ).toBe(true);
      expect(
        lte(
          state => state,
          (state, action) => action
        )(2, 3)
      ).toBe(true);
    });

    it('should compute falsy lesser or equal than', () => {
      expect(lte(2, 1)()).toBe(false);
      expect(
        lte(
          () => 2,
          () => 1
        )()
      ).toBe(false);
    });
  });
});
