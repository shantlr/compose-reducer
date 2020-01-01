import { composeReducer, onEach, setValue } from '../../src';

describe('recipes', () => {
  describe('normalization', () => {
    it('should normalize array of items', () => {
      const reducer = composeReducer(
        onEach(
          (state, action) => action.payload,
          setValue((state, { id }) => ['entities', id])
        )
      );

      expect(
        reducer({}, { payload: [{ id: 1 }, { id: 2 }, { id: 3 }] })
      ).toEqual({
        entities: {
          '1': {
            id: 1
          },
          '2': {
            id: 2
          },
          '3': {
            id: 3
          }
        }
      });
    });

    it('should normalize map of items', () => {
      const reducer = composeReducer(
        onEach(
          (state, action) => action.payload,
          setValue((state, { id }) => ['entities', id])
        )
      );

      expect(
        reducer({}, { payload: { 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 } } })
      ).toEqual({
        entities: {
          '1': {
            id: 1
          },
          '2': {
            id: 2
          },
          '3': {
            id: 3
          }
        }
      });
    });
  });
});
