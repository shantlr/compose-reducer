import { TrackingState } from '../../src/helpers/trackingState';

describe('helpers', () => {
  describe('trackingState', () => {
    it('should have initial state', () => {
      const initialState = {};
      const ts = new TrackingState(initialState);
      expect(ts.initialState).toBe(initialState);
    });
    it('should have initial action', () => {
      const action = { type: 'ACTION' };
      const ts = new TrackingState(null, action);
      expect(ts.initialAction).toBe(action);
    });
    it('should update root state', () => {
      const initialState = {};
      const ts = new TrackingState(initialState);
      ts.updateState('', 10);
      expect(ts.initialState).toBe(initialState);
      expect(ts.initialState).not.toBe(ts.nextState);
      expect(ts.nextState).toBe(10);
    });
    it('should update state', () => {
      const initialState = { field: { hello: 'world' } };
      const ts = new TrackingState(initialState);
      ts.updateState(['counter'], 0);
      expect(ts.initialState).toBe(initialState);
      expect(ts.initialState).not.toBe(ts.nextState);
      expect(ts.nextState.field).toBe(initialState.field);
      expect(ts.nextState).toEqual({
        counter: 0,
        field: { hello: 'world' }
      });
    });

    it('should unset root state', () => {
      const initialState = { field: { hello: 'world' } };
      const ts = new TrackingState(initialState);
      ts.unsetState([], 0);
      expect(ts.initialState).toBe(initialState);
      expect(ts.initialState).not.toBe(ts.nextState);
      expect(ts.nextState).toBe(undefined);
    });
    it('should unset state', () => {
      const initialState = { field: { hello: 'world' }, otherField: {} };
      const ts = new TrackingState(initialState);
      ts.unsetState(['field', 'hello'], 0);
      expect(ts.initialState).toBe(initialState);
      expect(ts.initialState).not.toBe(ts.nextState);
      expect(ts.initialState.field).not.toBe(ts.nextState.field);
      expect(ts.nextState).toEqual({
        field: {},
        otherField: {}
      });
      expect(ts.nextState.otherField).toBe(initialState.otherField);
    });
  });
});
