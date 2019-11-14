import { pipe } from '../../src/utils/pipe';

describe('utils', () => {
  describe('pipe', () => {
    it('should return a piped function', () => {
      const value = {};
      const ft = jest.fn(() => value);
      const pipedFt = pipe(ft);
      expect(typeof pipedFt === 'function').toBe(true);
    });

    it('should call given function', () => {
      const value = {};
      const ft = jest.fn(() => value);
      const pipedFt = pipe(ft);
      const res = pipedFt();
      expect(ft).toHaveBeenCalled();
      expect(res).toBe(value);
    });

    it('should pipe functions', () => {
      const add12 = jest.fn(arg => {
        arg.value += 12;
        return arg;
      });
      const mult5 = jest.fn(arg => {
        arg.value *= 5;
        return arg;
      });
      const sub3 = jest.fn(arg => {
        arg.value -= 3;
        return arg;
      });
      const pipedFt = pipe(add12, mult5, sub3);

      const res = pipedFt({ value: 1 });
      expect(add12).toHaveBeenCalled();
      expect(mult5).toHaveBeenCalled();
      expect(sub3).toHaveBeenCalled();
      expect(res).toEqual({ value: 62 });
    });
  });
});
