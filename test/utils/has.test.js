import { has } from '../../src/utils/has';

describe('utils', () => {
  describe('has', () => {
    it('should return true on root', () => {
      expect(has({}, [])).toBe(true);
    });

    it('should return false', () => {
      expect(has({}, ['field1'])).toBe(false);
    });

    it('should return true on field', () => {
      expect(has({ field1: {} }, ['field1'])).toBe(true);
    });

    it('should return true on field', () => {
      expect(has({ field1: { subField1: {} } }, ['field1', 'subField1'])).toBe(
        true
      );
    });

    it('should return false on missing nested field', () => {
      expect(has({ field1: { subField1: {} } }, ['field1', 'subField2'])).toBe(
        false
      );

      expect(has({ field1: { subField1: {} } }, ['field2', 'subField2'])).toBe(
        false
      );
    });
  });
});
