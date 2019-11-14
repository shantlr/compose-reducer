import { shallowClone } from '../../src/utils/shallowClone';

describe('utils', () => {
  describe('shallowClone', () => {
    describe('when value to clone is an object', () => {
      it('should return an object', () => {
        const value = {};
        const clone = shallowClone(value);
        expect(clone).toBeDefined();
        expect(clone.constructor).toBe(Object);
      });

      it('should return a new object', () => {
        const value = { hello: 'world' };
        const clone = shallowClone(value);
        expect(clone).not.toBe(value);
        expect(clone).toEqual(value);
      });

      it('should shallow clone field', () => {
        const value = { field1: { hello: 'world' } };
        const clone = shallowClone(value);
        expect(clone).not.toBe(value);
        expect(clone).toEqual(value);
        expect(clone.field1).toBe(value.field1);
      });
    });

    describe('when value to clone is an array', () => {
      it('should return an array', () => {
        const value = [];
        const clone = shallowClone(value);
        expect(clone).toBeDefined();
        expect(Array.isArray(clone)).toBe(true);
      });

      it('should return a new array', () => {
        const value = [1, 2, 3];
        const clone = shallowClone(value);
        expect(value).not.toBe(clone);
        expect(value).toEqual(clone);
      });

      it('should shallow copy array elem', () => {
        const value = [{ elem1: 'hello' }, { elem2: 'world' }];
        const clone = shallowClone(value);
        expect(value).not.toBe(clone);
        expect(value).toEqual(clone);
        value.forEach((elem, index) => {
          expect(elem).toBe(clone[index]);
        });
      });
    });
  });
});
