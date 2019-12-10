import { composeReducer, decValue } from '../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('decValue', () => {
      it('should decrease root value', () => {
        const reducer = composeReducer(decValue('', 1));
        expect(reducer(null)).toEqual(-1);
        expect(reducer(1)).toEqual(0);
        expect(reducer(3)).toEqual(2);
      });

      describe('when path is static', () => {
        it('should throw an error when path is invalid', () => {
          expect(() => decValue(true)).toThrow(
            '[decValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
          expect(() => decValue(42)).toThrow(
            '[decValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
          expect(() => decValue({ hello: 'world' })).toThrow(
            '[decValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
        });

        it('should decrease field when path is a nested string path', () => {
          const reducer = composeReducer(decValue('field1.subField1', 32));
          const state = {
            field1: {
              subField1: 10,
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: -22,
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

        it('should decrease field when path is an array', () => {
          const reducer = composeReducer(decValue(['field1'], 15));
          const state = { field1: 5, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: -10,
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should decrease field when path is a multi-level array path', () => {
          const reducer = composeReducer(
            decValue(['field1', 'subField1', 'subSubField'], 10)
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
              subField1: { hello: '42', subSubField: -10 },
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
          const reducer = composeReducer(decValue(pathResolver));

          const state = { hello: 'world' };
          const action = { type: 'ACTION' };
          reducer(state, action);

          expect(pathResolver).toHaveBeenCalled();
          expect(pathResolver.mock.calls[0][0]).toBe(state);
          expect(pathResolver.mock.calls[0][1]).toBe(action);
        });

        it('should throw an error when resolved path is invalid', () => {
          const pathResolver = jest.fn().mockReturnValue(42);
          const reducer = composeReducer(decValue(pathResolver));
          expect(reducer).toThrow(
            '[path-resolver] Resolved path is expected to be a string or an array of string but received'
          );
        });

        it('should decrease field when path is field name', () => {
          const pathResolver = jest.fn().mockReturnValue('field1');
          const reducer = composeReducer(decValue(pathResolver, 10));
          const state = { field1: 123, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: 113,
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
        it('should decrease field when path is a multi-level string path', () => {
          const pathResolver = jest.fn().mockReturnValue('field1.subField1');
          const reducer = composeReducer(decValue(pathResolver, 5));
          const state = {
            field1: {
              subField1: 123,
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: { subField1: 118, subField2: { another: 'hello' } },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should decrease field when path is an array', () => {
          const pathResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(decValue(pathResolver, 10));
          const state = { field1: 2, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: -8,
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should remove field when path is a nested path array', () => {
          const pathResolver = jest
            .fn()
            .mockReturnValue(['field1', 'subField1']);
          const reducer = composeReducer(decValue(pathResolver, 10));
          const state = {
            field1: {
              subField1: 123,
              subField2: { another: 'hello' }
            },
            field2: {},
            field3: { hello: 'world' }
          };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              subField1: 113,
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
    });
  });
});
