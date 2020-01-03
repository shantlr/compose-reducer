import {
  provideResolver,
  injectResolver
} from '../../../src/reducers/context/provideResolver';
import { composeReducer, incValue, decValue } from '../../../src';

describe('reducers', () => {
  describe('context', () => {
    describe('provideResolvers', () => {
      it('should inject resolver', () => {
        const reducer = composeReducer(
          provideResolver(
            {
              increase: incValue('', 5)
            },
            injectResolver('increase'),
            injectResolver('increase'),
            injectResolver('increase')
          )
        );
        expect(reducer()).toBe(15);
      });

      it('should be composable', () => {
        const reducer = composeReducer(
          provideResolver(
            {
              increase: incValue('', 5)
            },
            provideResolver(
              {
                decrease: decValue('', 1)
              },
              injectResolver('increase'),
              injectResolver('decrease')
            )
          )
        );
        expect(reducer()).toBe(4);
      });

      it('should override already provided reducer', () => {
        const reducer = composeReducer(
          provideResolver(
            {
              increase: incValue('', 5)
            },
            provideResolver(
              {
                increase: incValue('', 50)
              },
              injectResolver('increase')
            )
          )
        );
        expect(reducer()).toBe(50);
      });

      it('should throw error when trying to inject unprovided resolver', () => {
        const reducer = composeReducer(
          provideResolver({}, injectResolver('increase'))
        );
        expect(reducer).toThrow("Cannot inject unprovided resolver 'increase'");
      });
    });
  });
});
