import { composeReducer, branch, incValue, decValue, at } from '../../../src';

describe('reducers', () => {
  describe('flow', () => {
    describe('branch', () => {
      it('should call true resolver', () => {
        const reducer = composeReducer(
          branch(() => true, incValue('', 1), decValue('', 1))
        );

        expect(reducer(0)).toBe(1);
      });

      it('should call false resolver', () => {
        const reducer = composeReducer(
          branch(() => false, incValue('', 1), decValue('', 1))
        );
        expect(reducer(0)).toBe(-1);
      });

      it('should ignore if true resolver is not provided', () => {
        const reducer = composeReducer(branch(() => true, '', decValue('', 1)));
        expect(reducer(0)).toBe(0);
      });

      it('should ignore if false resolver is not provided', () => {
        const reducer = composeReducer(branch(() => false, incValue('', 1)));
        expect(reducer(0)).toBe(0);
      });

      it('should call predicate with relative path', () => {
        const predicate = jest.fn().mockImplementation(() => true);
        const reducer = composeReducer(
          at('counter', branch(predicate, incValue('', 1)))
        );

        expect(reducer({ counter: 0 })).toEqual({ counter: 1 });
        expect(predicate).toHaveBeenCalled();
        expect(predicate.mock.calls[0][0]).toBe(0);
      });
    });
  });
});
