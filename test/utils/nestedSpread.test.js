import { nestedSpread } from '../../src/utils/nestedSpread';

describe('util', () => {
  describe('nestedSpread', () => {
    it('should spread value on given property', () => {
      const state = { hello: { world: true } };
      const field1 = { hello: 'world' };
      const nextState = nestedSpread(state, ['field1'], field1);
      expect(nextState).toEqual({
        ...state,
        field1
      });
    });

    it('should spread value on given nested path', () => {
      const state = {
        hello: { world: true },
        field1: { hello: { world: true } }
      };
      const field2 = { helloworld: true };
      const nextState = nestedSpread(state, ['field1', 'field2'], field2);
      expect(nextState).toEqual({
        ...state,
        field1: {
          ...state.field1,
          field2
        }
      });
    });

    it('should merge on root', () => {
      const state = { hello: 'world' };
      const field = { field1: 'hello' };
      const nextState = nestedSpread(state, [], field);
      expect(nextState).toEqual({
        ...state,
        ...field
      });
    });

    it('should not mutate state', () => {
      const state = { field1: { hello: 'world' } };
      const field = { hello2: 'world' };
      const nextState = nestedSpread(state, ['field1'], field);
      expect(nextState).not.toBe(state);
      expect(state).toEqual({ field1: { hello: 'world' } });
      expect(nextState).toEqual({
        field1: { hello: 'world', hello2: 'world' }
      });
    });
  });
});
