import { onEach, withActions } from '../../../src';

describe('reducers', () => {
  describe('flow', () => {
    describe('onEach', () => {
      it('should equal withActions', () => {
        expect(onEach).toBe(withActions);
      });
    });
  });
});
