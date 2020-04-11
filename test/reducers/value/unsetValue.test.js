import { unsetValue, composeReducer } from '../../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('unsetValue', () => {
      it('should unset root', () => {
        const reducer = composeReducer(unsetValue(''));
        expect(reducer({ hello: 'world' })).toEqual(undefined);
      });

      it('should do no op if path is nil', () => {
        expect(composeReducer(unsetValue(null))('hello')).toEqual('hello');
        expect(composeReducer(unsetValue(undefined))('hello')).toEqual('hello');
        expect(composeReducer(unsetValue(() => null))('hello')).toEqual(
          'hello'
        );
        expect(composeReducer(unsetValue(() => {}))('hello')).toEqual('hello');
      });

      describe('when path is static', () => {
        it('should throw an error when path is invalid', () => {
          expect(() => unsetValue(true)).toThrow(
            '[unsetValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
          expect(() => unsetValue({ hello: 'world' })).toThrow(
            '[unsetValue]: Invalid pathResolver. Expected a string, an array of string or a function but received'
          );
        });

        it('should remove field when path is field name', () => {
          const reducer = composeReducer(unsetValue('field1'));
          const state = { field1: {}, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should remove field when path is a nested string path', () => {
          const reducer = composeReducer(unsetValue('field1.subField1'));
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
            field1: { subField2: { another: 'hello' } },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should remove field when path is an array', () => {
          const reducer = composeReducer(unsetValue(['field1']));
          const state = { field1: {}, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should remove field when path is a multi-level array path', () => {
          const reducer = composeReducer(unsetValue(['field1', 'subField1']));
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
            field1: { subField2: { another: 'hello' } },
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
          const reducer = composeReducer(unsetValue(pathResolver));

          const state = { hello: 'world' };
          const action = { type: 'ACTION' };
          reducer(state, action);

          expect(pathResolver).toHaveBeenCalled();
          expect(pathResolver.mock.calls[0][0]).toBe(state);
          expect(pathResolver.mock.calls[0][1]).toBe(action);
        });

        it('should throw an error when resolved path is invalid', () => {
          const pathResolver = jest.fn().mockReturnValue({ hello: 'world' });
          const reducer = composeReducer(unsetValue(pathResolver));
          expect(reducer).toThrow(
            '[path-resolver] Resolved path is expected to be a string or an array of string but received'
          );
        });

        it('should remove field when path is field name', () => {
          const pathResolver = jest.fn().mockReturnValue('field1');
          const reducer = composeReducer(unsetValue(pathResolver));
          const state = { field1: {}, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });
        it('should remove field when path is a multi-level string path', () => {
          const pathResolver = jest.fn().mockReturnValue('field1.subField1');
          const reducer = composeReducer(unsetValue(pathResolver));
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
            field1: { subField2: { another: 'hello' } },
            field2: {},
            field3: { hello: 'world' }
          });
          expect(nextState).not.toBe(state);
          expect(nextState.field1).not.toBe(state.field1);
          expect(nextState.field1.subField2).toBe(state.field1.subField2);
          expect(nextState.field2).toBe(state.field2);
          expect(nextState.field3).toBe(state.field3);
        });

        it('should remove field when path is an array', () => {
          const pathResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(unsetValue(pathResolver));
          const state = { field1: {}, field2: {}, field3: { hello: 'world' } };

          const nextState = reducer(state);
          expect(nextState).toEqual({
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
          const reducer = composeReducer(unsetValue(pathResolver));
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
            field1: { subField2: { another: 'hello' } },
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
