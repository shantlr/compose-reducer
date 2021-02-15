import { compute, getAction, getState } from '../../src';

describe('valueResolver', () => {
  describe('compute', () => {
    it('should compute simple value', () => {
      expect(compute(() => 'hello world')()).toBe('hello world');
      expect(
        compute(
          () => 'hello',
          () => ' world',
          (a, b) => a + b
        )()
      ).toBe('hello world');
    });

    it('should work with getAction and getState', () => {
      expect(
        compute(
          getState('hello'),
          getAction('world'),
          (a, b) => a + b
        )({ hello: 10 }, { world: 2 })
      ).toBe(12);
    });
  });
});
