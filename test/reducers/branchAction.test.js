import { composeReducer, incValue, decValue } from '../../src';
import { branchAction } from '../../src/reducers/branchAction';

describe('reducers', () => {
  describe('flow', () => {
    describe('branchAction', () => {
      describe('with object branching', () => {
        it('should reduce given action', () => {
          const reducer = composeReducer(
            branchAction({
              INC: incValue(null, 1),
              DEC: decValue(null, 1)
            })
          );
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INC' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });

        it('should ignore action when no reducer is provided', () => {
          const reducer = composeReducer(
            branchAction({
              INC: incValue(null, 1),
              DEC: decValue(null, 1)
            })
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
        });

        it('should call reducer when multiple object branching', () => {
          const reducer = composeReducer(
            branchAction(
              {
                INC: incValue(null, 1)
              },
              {
                DEC: decValue(null, 1)
              }
            )
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INC' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });

        it('should call reducer in right order', () => {
          const reducer = composeReducer(
            branchAction(
              {
                ACT: incValue(null, 1)
              },
              {
                ACT: incValue(null, 5)
              }
            )
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'ACT' })).toBe(6);
        });
      });

      describe('array branching', () => {
        it('should reduce given action', () => {
          const reducer = composeReducer(
            branchAction(['INC', incValue(null, 1)], ['DEC', decValue(null, 1)])
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INC' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });

        it('should reduce on alias type', () => {
          const reducer = composeReducer(
            branchAction(
              ['INC', 'INCREASE', incValue(null, 1)],
              ['DEC', decValue(null, 1)]
            )
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INCREASE' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });
      });

      describe('predicate branching', () => {
        it('should reduce given action', () => {
          const reducer = composeReducer(
            branchAction(
              [(state, action) => action.type === 'INC', incValue(null, 1)],
              [(state, action) => action.type === 'DEC', decValue(null, 1)]
            )
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INC' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });
      });

      describe('combining branchings', () => {
        it('should reduce predicate with array given action', () => {
          const reducer = composeReducer(
            branchAction(
              [
                (state, action) => action.type === 'INC',
                'INC',
                incValue(null, 1)
              ],
              [(state, action) => action.type === 'DEC', decValue(null, 1)]
            )
          );
          expect(reducer(0, { type: 'OTHER' })).toBe(0);
          expect(reducer(0, { type: 'INC' })).toBe(1);
          expect(reducer(1, { type: 'INCREASE' })).toBe(2);
          expect(reducer(1, { type: 'DEC' })).toBe(0);
        });
      });
    });
  });
});
