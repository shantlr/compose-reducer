import { ensureNewRefInNextState } from '../../src/helpers/ensureNewRef';

describe('helpers', () => {
  describe('ensureNewRef', () => {
    let state;
    let trackingState;
    beforeEach(() => {
      state = {
        field1: {
          hello: 'world',
          subField1: {
            array1: [{ elem: 1 }]
          }
        }
      };
      trackingState = { state, nextState: state, isNewReference: {} };
    });

    it('should create new root state when path is empty', () => {
      ensureNewRefInNextState(trackingState, []);
      expect(trackingState.nextState).not.toBe(state);
      expect(trackingState.nextState).toEqual(state);
      expect(trackingState.nextState.field1).toBe(state.field1);
    });

    it('should copy on each node of given path', () => {
      ensureNewRefInNextState(trackingState, ['field1', 'subField1']);
      expect(trackingState.nextState).not.toBe(state);
      expect(trackingState.nextState).toEqual(state);
      expect(trackingState.nextState.field1).not.toBe(state.field1);
      expect(trackingState.nextState.field1.subField1).not.toBe(
        state.field1.subField1
      );
      expect(trackingState.nextState.field1.subField1.array1).toBe(
        state.field1.subField1.array1
      );
    });
  });
});
