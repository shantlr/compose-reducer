import { updateState } from '../../src';

describe('helpers', () => {
  describe('updateState', () => {
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

    it('should update field', () => {
      const value = {};
      expect(updateState(trackingState, ['field1'], value));
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toEqual({
        field1: value
      });
      expect(trackingState.nextState.field1).toBe(value);
    });

    it('should update nested field', () => {
      const value = {};
      expect(updateState(trackingState, ['field1', 'subField2'], value));
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toEqual({
        field1: {
          subField1: {
            array: [{ elem: 1 }, { elem: 2 }, { elem: 3 }]
          },
          subField2: value
        }
      });
      expect(trackingState.nextState.field1.subField2).toBe(value);
      expect(trackingState.nextState.field1.subField1).toBe(
        state.field1.subField1
      );
    });

    it('should set field', () => {
      const value = {};
      expect(updateState(trackingState, ['field2'], value));
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toMatchObject(state);
      expect(trackingState.nextState.field2).toBe(value);
    });

    it('should set nested field', () => {
      const value = {};
      expect(updateState(trackingState, ['field1', 'subField3'], value));
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toMatchObject(state);
      expect(trackingState.nextState.field1.subField3).toBe(value);
    });

    it('should set nested field and create object for inexisting path', () => {
      const value = {};
      expect(updateState(trackingState, ['field2', 'subField3'], value));
      expect(trackingState.state).toBe(state);
      expect(trackingState.nextState).toMatchObject(state);
      expect(trackingState.nextState.field2).toEqual({ subField3: value });
      expect(trackingState.nextState.field2.subField3).toBe(value);
    });
  });
});
