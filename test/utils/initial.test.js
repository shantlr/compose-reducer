import { initial } from '../../src/utils/initial';

describe('utils', () => {
  describe('initial', () => {
    it('should create an empty array on empty array', () => {
      const array = [];
      const initialArray = initial(array);
      expect(initialArray).toEqual([]);
    });

    it('should create an empty array on array with only one element', () => {
      const array = [1];
      const initialArray = initial(array);
      expect(initialArray).toEqual([]);
    });

    it('should create an array without last element', () => {
      const array = [{ elem: 1 }, 2, 3, { elem: 4 }];
      const initialArray = initial(array);
      expect(Array.isArray(initialArray)).toBe(true);
      expect(initialArray.length).toBe(array.length - 1);
      initialArray.forEach((elem, index) => {
        expect(elem).toBe(array[index]);
      });
    });
  });
});
