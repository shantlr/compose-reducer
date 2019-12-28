import { composeReducers, branch, incValue, decValue } from '../../../src';

describe('reducers', () => {
  describe('flow', () => {
    describe('branch', () => {
      it('should call true resolver', () => {
        const reducer = composeReducers(
          branch(() => true, incValue(null, 1), decValue(null, 1))
        );

        expect(reducer(0)).toBe(1);
      });

      it('should call false resolver', () => {
        const reducer = composeReducers(
          branch(() => false, incValue(null, 1), decValue(null, 1))
        );
        expect(reducer(0)).toBe(-1);
      });

      it('should ignore if true resolver is not provided', () => {
        const reducer = composeReducers(
          branch(() => true, null, decValue(null, 1))
        );
        expect(reducer(0)).toBe(0);
      });

      it('should ignore if false resolver is not provided', () => {
        const reducer = composeReducers(branch(() => false, incValue(null, 1)));
        expect(reducer(0)).toBe(0);
      });
    });
  });
});
