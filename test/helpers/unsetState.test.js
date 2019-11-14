import { unsetState } from '../../src';

describe('helpers', () => {
  describe('unsetState', () => {
    let state;
    let trackingState;
    beforeEach(() => {
      state = {
        field1: {
          subField1: {
            array: [{ elem: 1 }, { elem: 2 }, { elem: 3 }]
          },
          subField2: {
            hello: 'world'
          }
        }
      };
      trackingState = {
        state,
        nextState: state,
        isNewReference: {}
      };
    });

    it('should remove field', () => {
      unsetState(trackingState, ['field1']);
      expect(trackingState.state).toBe(state);
      expect(trackingState.state).not.toBe(trackingState.nextState);
      expect(trackingState.nextState).toEqual({});
      expect(trackingState.nextState.field1).toBeUndefined();
    });
    it('should remove field', () => {
      unsetState(trackingState, ['field1']);
      expect(trackingState.state).toBe(state);
      expect(trackingState.state).not.toBe(trackingState.nextState);
      expect(trackingState.nextState).toEqual({});
      expect(trackingState.nextState.field1).toBeUndefined();
    });

    it('should remove nested field', () => {
      unsetState(trackingState, ['field1', 'subField1']);
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState.field1.subField1).toBeUndefined();
      expect(trackingState.nextState).toEqual({
        field1: {
          subField2: {
            hello: 'world'
          }
        }
      });
      expect(trackingState.state).not.toBe(trackingState.nextState);
      expect(trackingState.nextState.field1).not.toBe(
        trackingState.state.field1
      );
      expect(trackingState.state.field1.subField2).toBe(
        trackingState.nextState.field1.subField2
      );
    });

    it('should do nothing if path inexisting', () => {
      unsetState(trackingState, ['field3']);
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toBe(state);
    });

    it('should do nothing if path inexisting', () => {
      unsetState(trackingState, ['field1', 'subField3']);
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toBe(state);
    });
  });
});
