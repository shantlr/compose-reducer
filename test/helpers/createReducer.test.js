import { createReducer } from '../../src';
import { TrackingState } from '../../src/helpers/trackingState';

describe('helpers', () => {
  describe('createReducer', () => {
    it('should create a tracking state reducer', () => {
      const trackingState = new TrackingState();
      const reduce = jest.fn();
      expect(createReducer(reduce)(trackingState)).toBe(trackingState);
      expect(reduce).toHaveBeenCalled();
      expect(reduce).toHaveBeenCalledWith(trackingState);
    });

    it('should throw an error if used without a trackingState', () => {
      const reduce = jest.fn();
      expect(createReducer(reduce)).toThrow(
        'Invalid tracking state. Did you use composable-reducer without composeReducers ?'
      );
    });
  });
});
