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

      describe('static path', () => {
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

      describe('dynamic path', () => {});
    });
  });
});
