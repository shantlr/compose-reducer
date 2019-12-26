import { TrackingState } from '../../src/helpers/trackingState';
import { wrapPathResolver } from '../../src/helpers/resolve';

describe('helpers', () => {
  describe('wrapResolvePath', () => {
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
      wrapPathResolver(pathResolver)(trackingState);
      expect(pathResolver).toHaveBeenCalled();
      expect(pathResolver.mock.calls[0][0]).toBe(state);
      expect(pathResolver.mock.calls[0][1]).toBe(action);
    });

    it('should resolve root path', () => {
      expect(wrapPathResolver()(trackingState)).toEqual([]);
      expect(wrapPathResolver(null)(trackingState)).toEqual([]);
      expect(wrapPathResolver('')(trackingState)).toEqual([]);
      expect(wrapPathResolver(() => '')(trackingState)).toEqual([]);
      expect(wrapPathResolver(() => [])(trackingState)).toEqual([]);
    });

    it('should resolve simple string path', () => {
      expect(wrapPathResolver('field')(trackingState)).toEqual(['field']);
      expect(wrapPathResolver(() => 'field')(trackingState)).toEqual(['field']);
    });

    it('should resolve nested string path', () => {
      expect(wrapPathResolver('field.subField')(trackingState)).toEqual([
        'field',
        'subField'
      ]);
      expect(wrapPathResolver(() => 'field.subField')(trackingState)).toEqual([
        'field',
        'subField'
      ]);
    });

    it('should resolve simple array path', () => {
      expect(wrapPathResolver(['field'])(trackingState)).toEqual(['field']);
      expect(wrapPathResolver(() => ['field'])(trackingState)).toEqual([
        'field'
      ]);
    });

    it('should resolve nested string path', () => {
      expect(wrapPathResolver(['field', 'subField'])(trackingState)).toEqual([
        'field',
        'subField'
      ]);
      expect(
        wrapPathResolver(() => ['field', 'subField'])(trackingState)
      ).toEqual(['field', 'subField']);
    });
  });
});
