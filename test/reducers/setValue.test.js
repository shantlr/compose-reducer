import { setValue, composeReducer } from '../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('setAction', () => {
      it('should set root value', () => {
        const value = { hello: 'world' };
        const reducer = composeReducer(setValue(null, value));

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
            expect(reducer({ field1: '' })).toEqual({
              field1: 'hello world'
            });
          });

          it('should set nested static path', () => {
            const reducer = composeReducer(
              setValue('field1.nested', 'hello world')
            );

            expect(reducer({ field1: { hello: 'world', nested: '' } })).toEqual(
              {
                field1: {
                  hello: 'world',
                  nested: 'hello world'
                }
              }
            );
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

        it('should set dyanmic path value', () => {
          const reducer = composeReducer(setValue('field1', 'hello world'));
          expect(reducer({ field1: '' })).toEqual({
            field1: 'hello world'
          });
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
    });
  });
});
