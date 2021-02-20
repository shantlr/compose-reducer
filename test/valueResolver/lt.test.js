import { lt } from '../../src';

describe('valueResolver', () => {
  describe('lt', () => {
    it('should compute truthy lesser than', () => {
      expect(lt(1, 2)()).toBe(true);
      expect(
        lt(
          () => 1,
          () => 2
        )()
      ).toBe(true);
      expect(
        lt(
          state => state,
          (state, action) => action
        )(2, 3)
      ).toBe(true);
    });

    it('should compute falsy lesser than', () => {
      expect(lt(2, 1)()).toBe(false);
      expect(lt(2, 2)()).toBe(false);
      expect(
        lt(
          () => 2,
          () => 2
        )()
      ).toBe(false);
    });
  });
});
