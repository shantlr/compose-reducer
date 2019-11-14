import { get } from '../../src/utils/get';

describe('utils', () => {
  describe('get', () => {
    describe('when path is empty', () => {
      it('should return root when path is empty array', () => {
        const value = {};
        expect(get(value, [])).toBe(value);
      });
      it('should return root when path is null', () => {
        const value = {};
        expect(get(value, null)).toBe(value);
      });
      it('should return root when path is null', () => {
        const value = {};
        expect(get(value, null)).toBe(value);
      });
      it('should return root when path is empty string', () => {
        const value = {};
        expect(get(value, '')).toBe(value);
      });
    });

    describe('when path is not empty array', () => {
      describe('when field is not defined in value', () => {
        it('should return undefined when path does not exist', () => {
          const value = {};
          expect(get(value, ['field1'])).toBe(undefined);
        });
        it('should return undefined when nested path does not exist', () => {
          const value = { field1: {} };
          expect(get(value, ['field1', 'field2', 'field3'])).toBe(undefined);
        });
      });

      describe('when field is defined in value', () => {
        it('should return field', () => {
          const value = { field1: { field2: {} } };
          expect(get(value, ['field1'])).toBe(value.field1);
        });

        it('should return nested field', () => {
          const value = { field1: { field2: {} } };
          expect(get(value, ['field1', 'field2'])).toBe(value.field1.field2);
        });
      });
    });
  });
});
