import { onEach, mapActions } from '../../../src';

describe('reducers', () => {
  describe('flow', () => {
    describe('onEach', () => {
      it('should equal mapActions', () => {
        expect(onEach).toBe(mapActions);
      });
    });
  });
});
