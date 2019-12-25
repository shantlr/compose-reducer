import { composeReducer, popValues } from '../../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('popValues', () => {
      it('should pop values to root value', () => {
        const reducer = composeReducer(popValues('', 1));
        expect(reducer(null)).toEqual(null);
        expect(reducer([1])).toEqual([1]);
        expect(reducer([3, 2, 1])).toEqual([3, 1]);
      });

      it('should pop array of values to root value', () => {
        const reducer = composeReducer(popValues('', [0, 1]));
        expect(reducer(null)).toEqual(null);
        expect(reducer([1])).toEqual([]);
        expect(reducer([3, 2, 1])).toEqual([1]);
      });

      describe('when path is static', () => {
        it('should throw an error when path is invalid', () => {
          expect(() => popValues(true)).toThrow(
            '[popValues]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
          expect(() => popValues({ hello: 'world' })).toThrow(
            '[popValues]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
        });
        it('should throw an error when previous value is invalid', () => {
          const reducer = composeReducer(popValues('', 10));

          const state = { hello: 'world' };
          const action = { type: 'ACTION' };
          expect(() => reducer(state, action)).toThrow(
            '[popValues] previous value is not iterable'
          );
        });

        it('should do nothing when index is -1', () => {
          const reducer = composeReducer(popValues('field1.subField1', -1));
          const state = {
            field1: {
              subField1: [1, 2, 3, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: [1, 2, 3, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).toBe(state);
          expect(nextState.field1).toBe(state.field1);
          expect(nextState.field1.subField1).toBe(state.field1.subField1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should do nothing when index is out of scope', () => {
          const reducer = composeReducer(popValues('field1.subField1', 10));
          const state = {
            field1: {
              subField1: [1, 2, 3, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: [1, 2, 3, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).toBe(state);
          expect(nextState.field1).toBe(state.field1);
          expect(nextState.field1.subField1).toBe(state.field1.subField1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should pop value when path is a nested string path', () => {
          const reducer = composeReducer(popValues('field1.subField1', 2));
          const state = {
            field1: {
              subField1: [1, 2, 3, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: [1, 2, 4],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField1).not.toBe(state.field1.subField1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should pop value when path is an array', () => {
          const reducer = composeReducer(popValues(['field1'], 0));
          const state = {
            field1: [10, 15],
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: [15],
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should pop value when path is a multi-level array path', () => {
          const reducer = composeReducer(
            popValues(['field1', 'subField1', 'subSubField'], 2)
          );
          const state = {
            field1: {
              subField1: { hello: '42', subSubField: [1, 2, 3] },
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: { hello: '42', subSubField: [1, 2] },
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
      });

      describe('when path is dynamic', () => {
        it('should call path resolver with state and action', () => {
          const pathResolver = jest.fn().mockReturnValue('');
          const reducer = composeReducer(popValues(pathResolver, 10));

          const state = [];
          const action = { type: 'ACTION' };
          reducer(state, action);

          expect(pathResolver).toHaveBeenCalled();
          expect(pathResolver.mock.calls[0][0]).toBe(state);
          expect(pathResolver.mock.calls[0][1]).toBe(action);
        });

        it('should throw an error when resolved path is invalid', () => {
          const pathResolver = jest.fn().mockReturnValue(42);
          const reducer = composeReducer(popValues(pathResolver, 10));
          expect(reducer).toThrow(
            '[path-resolver] Resolved path is expected to be a string or an array of string but received'
          );
        });

        it('should pop value when path is field name', () => {
          const pathResolver = jest.fn().mockReturnValue('field1');
          const reducer = composeReducer(popValues(pathResolver, 0));
          const state = {
            field1: [123],
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: [],
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
        it('should pop value when path is a multi-level string path', () => {
          const pathResolver = jest.fn().mockReturnValue('field1.subField1');
          const reducer = composeReducer(popValues(pathResolver, 1));
          const state = {
            field1: {
              subField1: [1, 2, 3],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: { subField1: [1, 3], subField2: { another: 'hello' } },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should pop value when path is an array', () => {
          const pathResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(popValues(pathResolver, 0));
          const state = {
            field1: [2, 10],
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: [10],
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should pop value when path is a nested path array', () => {
          const pathResolver = jest
            .fn()
            .mockReturnValue(['field1', 'subField1']);
          const reducer = composeReducer(popValues(pathResolver, 0));
          const state = {
            field1: {
              subField1: [123],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: [],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
      });

      it('should call value resolver with state and action', () => {
        const valueResolver = jest.fn().mockReturnValue(42);
        const reducer = composeReducer(popValues('', valueResolver));

        const state = [];
        const action = { type: 'ACTION' };
        reducer(state, action);

        expect(valueResolver).toHaveBeenCalled();
        expect(valueResolver.mock.calls[0][0]).toBe(state);
        expect(valueResolver.mock.calls[0][1]).toBe(action);
      });
    });
  });
});
