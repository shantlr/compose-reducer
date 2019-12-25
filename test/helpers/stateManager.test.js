import { StateManager } from '../../src/helpers/trackingState/stateManager';

describe('helpers', () => {
  describe('stateManager', () => {
    describe('getRefKey', () => {
      it('should compute root refKey', () => {
        const stateManager = new StateManager();
        expect(stateManager.getRefKey([])).toBe('');
        expect(stateManager.getRefKey()).toBe('');
        expect(stateManager.getRefKey('')).toBe('');
        expect(stateManager.getRefKey(null)).toBe('');
        expect(stateManager.getRefKey(undefined)).toBe('');
      });
    });

    describe('ensureNewRef', () => {
      let initialState;
      let stateManager;
      beforeEach(() => {
        initialState = {
          field1: {
            hello: 'world',
            subField1: {
              array1: [{ elem: 1 }]
            }
          }
        };

        stateManager = new StateManager(initialState);
      });

      it('should create new root state when path is empty', () => {
        stateManager.ensureNewRefInNextState([]);
        expect(stateManager.nextState).not.toBe(initialState);
        expect(stateManager.nextState).toEqual(initialState);
        expect(stateManager.nextState.field1).toBe(initialState.field1);
      });

      it('should copy on each node of given path', () => {
        stateManager.ensureNewRefInNextState(['field1', 'subField1']);
        expect(stateManager.nextState).not.toBe(initialState);
        expect(stateManager.nextState).toEqual(initialState);
        expect(stateManager.nextState.field1).not.toBe(initialState.field1);
        expect(stateManager.nextState.field1.subField1).not.toBe(
          initialState.field1.subField1
        );
        expect(stateManager.nextState.field1.subField1.array1).toBe(
          initialState.field1.subField1.array1
        );
      });
    });

    describe('updateState', () => {
      let initialState;
      let stateManager;
      beforeEach(() => {
        initialState = {
          field1: {
            subField1: {
              array: [{ elem: 1 }, { elem: 2 }, { elem: 3 }]
            },
            subField2: {
              hello: 'world'
            }
          }
        };
        stateManager = new StateManager(initialState);
      });

      it('should update field', () => {
        const value = {};
        expect(stateManager.updateState(['field1'], value));
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toEqual({
          field1: value
        });
        expect(stateManager.nextState.field1).toBe(value);
      });

      it('should update nested field', () => {
        const value = {};
        expect(stateManager.updateState(['field1', 'subField2'], value));
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toEqual({
          field1: {
            subField1: {
              array: [{ elem: 1 }, { elem: 2 }, { elem: 3 }]
            },
            subField2: value
          }
        });
        expect(stateManager.nextState.field1.subField2).toBe(value);
        expect(stateManager.nextState.field1.subField1).toBe(
          initialState.field1.subField1
        );
      });

      it('should set field', () => {
        const value = {};
        expect(stateManager.updateState(['field2'], value));
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toMatchObject(initialState);
        expect(stateManager.nextState.field2).toBe(value);
      });

      it('should set nested field', () => {
        const value = {};
        expect(stateManager.updateState(['field1', 'subField3'], value));
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toMatchObject(initialState);
        expect(stateManager.nextState.field1.subField3).toBe(value);
      });

      it('should set nested field and create object for inexisting path', () => {
        const value = {};
        expect(stateManager.updateState(['field2', 'subField3'], value));
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toMatchObject(initialState);
        expect(stateManager.nextState.field2).toEqual({ subField3: value });
        expect(stateManager.nextState.field2.subField3).toBe(value);
      });
    });

    describe('unsetState', () => {
      let initialState;
      let stateManager;
      beforeEach(() => {
        initialState = {
          field1: {
            subField1: {
              array: [{ elem: 1 }, { elem: 2 }, { elem: 3 }]
            },
            subField2: {
              hello: 'world'
            }
          }
        };
        stateManager = new StateManager(initialState);
      });

      it('should remove field', () => {
        stateManager.unsetState(['field1']);
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.initialState).not.toBe(stateManager.nextState);
        expect(stateManager.nextState).toEqual({});
        expect(stateManager.nextState.field1).toBeUndefined();
      });
      it('should remove field', () => {
        stateManager.unsetState(['field1']);
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.initialState).not.toBe(stateManager.nextState);
        expect(stateManager.nextState).toEqual({});
        expect(stateManager.nextState.field1).toBeUndefined();
      });

      it('should remove nested field', () => {
        stateManager.unsetState(['field1', 'subField1']);
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState.field1.subField1).toBeUndefined();
        expect(stateManager.nextState).toEqual({
          field1: {
            subField2: {
              hello: 'world'
            }
          }
        });
        expect(stateManager.initialState).not.toBe(stateManager.nextState);
        expect(stateManager.nextState.field1).not.toBe(
          stateManager.initialState.field1
        );
        expect(stateManager.initialState.field1.subField2).toBe(
          stateManager.nextState.field1.subField2
        );
      });

      it('should do nothing if path inexisting', () => {
        stateManager.unsetState(['field3']);
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toBe(initialState);
      });

      it('should do nothing if path inexisting', () => {
        stateManager.unsetState(['field1', 'subField3']);
        expect(stateManager.initialState).toBe(initialState);
        expect(stateManager.nextState).toBe(initialState);
      });
    });
  });
});
