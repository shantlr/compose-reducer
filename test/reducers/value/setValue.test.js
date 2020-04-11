import { setValue, composeReducer } from '../../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('setValue', () => {
      it('should do no op if path is nil', () => {
        expect(
          composeReducer(setValue(() => null, 'hello world'))('hello')
        ).toEqual('hello');
        expect(composeReducer(setValue(null, 'hello world'))('hello')).toEqual(
          'hello'
        );
        expect(
          composeReducer(setValue(undefined, 'hello world'))('hello')
        ).toEqual('hello');
        expect(
          composeReducer(setValue(() => {}, 'hello world'))('hello')
        ).toEqual('hello');
      });

      it('should set root value', () => {
        const value = { hello: 'world' };
        const reducer = composeReducer(setValue('', value));

        expect(reducer(null)).toBe(value);
        expect(reducer('something else')).toBe(value);
        expect(reducer({ hello: 'world....' })).toBe(value);
      });

      describe('when path is static', () => {
        describe('when value is static', () => {
          it('should set string value as is', () => {
            const reducer = composeReducer(setValue('', 'hello world'));

            expect(reducer('')).toEqual('hello world');
          });
        });

        describe('when path did not exist', () => {
          it('should set static path value', () => {
            const reducer = composeReducer(setValue('field1', 'hello world'));
            expect(reducer(null)).toEqual({
              field1: 'hello world'
            });
          });

          it('should set static nested path value', () => {
            const reducer = composeReducer(
              setValue('field1.subfield', 'hello world')
            );
            expect(reducer(null)).toEqual({
              field1: { subfield: 'hello world' }
            });
          });
        });

        describe('when path did exist', () => {
          it('should set static path value', () => {
            const reducer = composeReducer(setValue('field1', 'hello world'));

            const state = { field1: '' };
            const nextState = reducer(state);
            expect(nextState).toEqual({
              field1: 'hello world'
            });
            expect(state).not.toBe(nextState);
          });

          it('should set nested static path', () => {
            const reducer = composeReducer(
              setValue('field1.nested', 'hello world')
            );
            const state = {
              field1: { hello: { another: 'hello' }, nested: '' }
            };
            const nextState = reducer(state);
            expect(nextState).toEqual({
              field1: {
                hello: { another: 'hello' },
                nested: 'hello world'
              }
            });
            expect(state).not.toBe(nextState);
            expect(state.field1).not.toBe(nextState.field1);
            expect(state.field1.hello).toBe(nextState.field1.hello);
          });
        });
      });

      describe('dynamic path', () => {
        it('should call path resolver with state and action', () => {
          const pathResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(setValue(pathResolver, 'hello world'));
          const state = { field1: 'value' };
          const action = { type: 'ACTION' };
          reducer(state, action);
          expect(pathResolver).toHaveBeenCalled();
          expect(pathResolver.mock.calls[0][0]).toBe(state);
          expect(pathResolver.mock.calls[0][1]).toBe(action);
        });

        it('should set value with string path ', () => {
          const reducer = composeReducer(
            setValue(() => 'field1', 'hello world')
          );

          const state = { field1: '', field2: {} };
          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: 'hello world',
            field2: {}
          });
          expect(state).not.toBe(nextState);
          expect(state.field2).toBe(nextState.field2);
        });

        it('should set value with multi-level string path', () => {
          const reducer = composeReducer(
            setValue(() => 'field1.nested.nested2', 'hello world')
          );

          const state = { field1: { hello: { world: true } }, field2: {} };
          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              hello: { world: true },
              nested: {
                nested2: 'hello world'
              }
            },
            field2: {}
          });
          expect(state).not.toBe(nextState);
          expect(state.field1).not.toBe(nextState.field1);
          expect(state.field1.hello).toBe(nextState.field1.hello);
          expect(state.field2).toBe(nextState.field2);
        });

        it('should set value with array path ', () => {
          const reducer = composeReducer(
            setValue(() => ['field1'], 'hello world')
          );

          const state = { field1: '', field2: {} };
          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: 'hello world',
            field2: {}
          });
          expect(state).not.toBe(nextState);
          expect(state.field2).toBe(nextState.field2);
        });

        it('should set value with multi-level array path', () => {
          const reducer = composeReducer(
            setValue(() => ['field1', 'nested', 'nested2'], 'hello world')
          );

          const state = { field1: { hello: { world: true } }, field2: {} };
          const nextState = reducer(state);
          expect(nextState).toEqual({
            field1: {
              hello: { world: true },
              nested: {
                nested2: 'hello world'
              }
            },
            field2: {}
          });
          expect(state).not.toBe(nextState);
          expect(state.field1).not.toBe(nextState.field1);
          expect(state.field1.hello).toBe(nextState.field1.hello);
          expect(state.field2).toBe(nextState.field2);
        });
      });

      describe('dynamic value', () => {
        it('should call value resolver with state and action', () => {
          const valueResolver = jest.fn().mockReturnValue(['field1']);
          const reducer = composeReducer(setValue('', valueResolver));
          const state = { field1: 'value' };
          const action = { type: 'ACTION' };
          reducer(state, action);
          expect(valueResolver).toHaveBeenCalled();
          expect(valueResolver.mock.calls[0][0]).toBe(state);
          expect(valueResolver.mock.calls[0][1]).toBe(action);
        });
      });

      describe('when value resolver is not provided', () => {
        it('should set action as value', () => {
          const reducer = composeReducer(setValue(''));
          expect(reducer('', 10)).toBe(10);
        });
      });
    });
  });
});
