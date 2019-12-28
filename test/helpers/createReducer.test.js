import { createReducer } from '../../src';

describe('helpers', () => {
  describe('createReducer', () => {
    it('should create a tracking state reducer', () => {
      const trackingState = {};
      const reduce = jest.fn();
      expect(createReducer(reduce)(trackingState)).toBe(trackingState);
      expect(reduce).toHaveBeenCalled();
      expect(reduce).toHaveBeenCalledWith(trackingState);
    });
  });
});
