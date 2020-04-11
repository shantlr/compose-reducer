import {
  composable,
  branchAction,
  pushValue,
  composeReducer,
  at,
  initState,
  setValue
} from '../../src';

describe('recipes', () => {
  describe('combineReducer', () => {
    const reduceTodos = composable(
      initState([]),
      branchAction({
        ADD_TODO: pushValue('', (state, action) => ({ text: action.text }))
      })
    );

    const reduceVisibility = composable(
      initState('SHOW_ALL'),
      branchAction({
        SET_VISIBILITY_FILTER: setValue(
          '',
          (state, action) => action.visibility
        )
      })
    );

    const reducer = composeReducer(
      at('todos', reduceTodos),
      at('visibility', reduceVisibility)
    );

    it('should init state', () => {
      expect(reducer()).toEqual({
        todos: [],
        visibility: 'SHOW_ALL'
      });
    });
  });
});
