import { last } from '../../src/utils/last';

describe('utils', () => {
  describe('last', () => {
    it('should return undefined when array is empty', () => {
      expect(last([])).toBe(undefined);
    });

    it('should return only element when array is of size 1', () => {
      const array = [{}];
      expect(last(array)).toBe(array[0]);
    });

    it('should return last element', () => {
      const array = [{}, {}];
      expect(last(array)).toBe(array[1]);
    });
  });
});
