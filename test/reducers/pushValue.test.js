import { composeReducer, pushValue } from '../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('pushValue', () => {
      it('should push value to root value', () => {
        const reducer = composeReducer(pushValue('', 10));
        expect(reducer(null)).toEqual([10]);
        expect(reducer([1])).toEqual([1, 10]);
        expect(reducer([3, 2, 1])).toEqual([3, 2, 1, 10]);
      });

      describe('when path is static', () => {
        it('should throw an error when path is invalid', () => {
          expect(() => pushValue(true)).toThrow(
            '[pushValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
          expect(() => pushValue({ hello: 'world' })).toThrow(
            '[pushValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
        });
        it('should throw an error when previous valus is invalid', () => {
          const reducer = composeReducer(pushValue('', 10));

          const state = { hello: 'world' };
          const action = { type: 'ACTION' };
          expect(() => reducer(state, action)).toThrow(
            '[pushValue] previous value is not iterable'
          );
        });

        it('should push value to field when path is a nested string path', () => {
          const reducer = composeReducer(pushValue('field1.subField1', 32));
          const state = {
            field1: {
              subField1: [],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: [32],
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

        it('should push value to field when path is an array', () => {
          const reducer = composeReducer(pushValue(['field1'], 15));
          const state = { field1: [], field2: {}, field3: { hello: 'world' } };

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

        it('should push value to field when path is a multi-level array path', () => {
          const reducer = composeReducer(
            pushValue(['field1', 'subField1', 'subSubField'], 10)
          );
          const state = {
            field1: {
              subField1: { hello: '42' },
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: { hello: '42', subSubField: [10] },
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
          const reducer = composeReducer(pushValue(pathResolver, []));

          const state = [];
          const action = { type: 'ACTION' };
          reducer(state, action);

          expect(pathResolver).toHaveBeenCalled();
          expect(pathResolver.mock.calls[0][0]).toBe(state);
          expect(pathResolver.mock.calls[0][1]).toBe(action);
        });

        it('should throw an error when resolved path is invalid', () => {
          const pathResolver = jest.fn().mockReturnValue(42);
          const reducer = composeReducer(pushValue(pathResolver, 10));
          expect(reducer).toThrow(
            '[path-resolver] Resolved path is expected to be a string or an array of string but received'
          );
        });

        it('should push value to field when path is field name', () => {
          const pathResolver = jest.fn().mockReturnValue('field1');
          const reducer = composeReducer(pushValue(pathResolver, [10]));
          const state = {
            field1: [123],
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: [123, [10]],
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
        it('should push value to field when path is a multi-level string path', () => {
          const pathResolver = jest.fn().mockReturnValue('field1.subField1');
          const reducer = composeReducer(pushValue(pathResolver, 5));
          const state = {
            field1: {
              subField1: [123, 5],
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: { subField1: [123, 5, 5], subField2: { another: 'hello' } },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should push value to field when path is an array', () => {
          const pathResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(pushValue(pathResolver, 10));
          const state = { field1: [2], field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: [2, 10],
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should push value to field when path is a nested path array', () => {
          const pathResolver = jest
            .fn()
            .mockReturnValue(['field1', 'subField1']);
          const reducer = composeReducer(pushValue(pathResolver, 10));
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
              subField1: [123, 10],
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
        const reducer = composeReducer(pushValue('', valueResolver));

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
