import { eq } from '../../src';

describe('valueResolver', () => {
  describe('eq', () => {
    it('should compute equality', () => {
      expect(eq(true, true)()).toBe(true);
      expect(eq('hello', 'hello')()).toBe(true);
      expect(eq(1, 1)()).toBe(true);
      expect(eq(null, null)()).toBe(true);
      expect(eq(null, null)()).toBe(true);

      const obj = {};
      expect(eq(obj, obj)()).toBe(true);
    });
    it('should compute inequality', () => {
      expect(eq(true, false)()).toBe(false);
      expect(eq('hello', 'hello')()).toBe(true);
      expect(eq(1, 1)()).toBe(true);
      expect(eq(null, null)()).toBe(true);
      expect(eq(null, null)()).toBe(true);
    });
  });
});
