import { composeReducer, mergeValue } from '../../../src';

describe('reducers', () => {
  describe('value', () => {
    describe('mergeValue', () => {
      it('should add fields', () => {
        const reducer = composeReducer(
          mergeValue('', {
            hello: 'world'
          })
        );
        expect(reducer({})).toEqual({
          hello: 'world'
        });
      });

      it('should add fields', () => {
        const reducer = composeReducer(
          mergeValue('', {
            hello: 'world'
          })
        );
        expect(
          reducer({
            hello: 'w'
          })
        ).toEqual({
          hello: 'world'
        });
      });

      it('should do nothing', () => {
        const reducer = composeReducer(mergeValue('', null));
        expect(
          reducer({
            count: 0
          })
        ).toEqual({
          count: 0
        });
      });
    });
  });
});
