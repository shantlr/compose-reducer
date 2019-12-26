import { wrapValueResolver } from '../../src/helpers/resolve';
import { TrackingState } from '../../src/helpers/trackingState';

describe('helpers', () => {
  describe('wrapValueResolver', () => {
    let state;
    let action;
    let trackingState;
    beforeEach(() => {
      state = {};
      action = {};
      trackingState = new TrackingState(state, action);
    });

    it('should call dynamic resolver', () => {
      const pathResolver = jest.fn().mockReturnValue('field');
      wrapValueResolver(pathResolver)(trackingState);
      expect(pathResolver).toHaveBeenCalled();
      expect(pathResolver.mock.calls[0][0]).toBe(state);
      expect(pathResolver.mock.calls[0][1]).toBe(action);
    });

    it('should resolve static value', () => {
      expect(wrapValueResolver(null)(trackingState)).toBe(null);
      expect(wrapValueResolver(0)(trackingState)).toBe(0);
      expect(wrapValueResolver(42)(trackingState)).toBe(42);
      expect(wrapValueResolver('hello world')(trackingState)).toBe(
        'hello world'
      );
      expect(wrapValueResolver(true)(trackingState)).toBe(true);
      expect(wrapValueResolver(false)(trackingState)).toBe(false);

      const staticObject = {};
      expect(wrapValueResolver(staticObject)(trackingState)).toBe(staticObject);
    });

    it('should resolve to action when resolver is not provided', () => {
      expect(wrapValueResolver()(trackingState)).toBe(action);
    });

    it('should resolve dynamic', () => {
      const value = {};
      expect(wrapValueResolver(() => value)(trackingState)).toBe(value);
    });
  });
});
