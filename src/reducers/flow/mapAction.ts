import { withContextBase } from '../context/withContext';
import {
  StaticOrValueResolver,
  wrapValueResolver
} from '../../helpers/resolve';
import {
  ACTION_OVERRIDE_SYMBOL,
  TrackingState
} from '../../helpers/trackingState';
import { ComposableReducer, createReducer } from '../../helpers/createReducer';

export const mapAction = <State, Action, MappedAction>(
  actionResolver: StaticOrValueResolver<State, Action, MappedAction>,
  ...composableReducers: ComposableReducer<State, MappedAction>[]
): ComposableReducer<State, Action> => {
  const valueResolver = wrapValueResolver(actionResolver);

  const mapContextAction = (trackingState: TrackingState<State, Action>) => ({
    [ACTION_OVERRIDE_SYMBOL]: valueResolver(trackingState)
  });

  return withContextBase(mapContextAction, composableReducers);
};

export const mapActions = <State, Action, MappedAction>(
  actionsResolver: StaticOrValueResolver<State, Action, MappedAction[]>,
  ...composableReducers: ComposableReducer<State, MappedAction>[]
): ComposableReducer<State, Action> => {
  const resolveActions = wrapValueResolver(actionsResolver);

  return createReducer(trackingState => {
    const actions = resolveActions(trackingState);

    const resolve = (action: MappedAction, index: string | number) => {
      const mapContextAction = (
        _trackingState: TrackingState<State, Action>
      ) => ({
        [ACTION_OVERRIDE_SYMBOL]: action,
        actionKey: index
      });

      return withContextBase(
        mapContextAction,
        composableReducers
      )(trackingState);
    };

    if (Array.isArray(actions)) {
      actions.forEach(resolve);
    } else if (typeof actions === 'object') {
      Object.keys(actions).forEach(key => {
        resolve(actions[key], key);
      });
    }
  });
};

export const onEach = mapActions;
