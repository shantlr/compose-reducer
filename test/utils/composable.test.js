import { composable, pipe } from '../../src';

describe('utils', () => {
  describe('composable', () => {
    it('should be pipe', () => {
      expect(composable).toBe(pipe);
    });
  });
});
