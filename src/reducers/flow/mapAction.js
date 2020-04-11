import { withContextBase } from '../context/withContext';
import { wrapValueResolver } from '../../helpers/resolve';
import { ACTION_OVERRIDE_SYMBOL } from '../../helpers/trackingState';
import { createReducer } from '../../helpers/createReducer';

export const mapAction = (actionResolver, ...composableReducers) => {
  const valueResolver = wrapValueResolver(actionResolver);

  const mapContextAction = trackingState => ({
    [ACTION_OVERRIDE_SYMBOL]: valueResolver(trackingState)
  });

  return withContextBase(mapContextAction, composableReducers);
};

export const mapActions = (actionsResolver, ...composableReducers) => {
  const resolveActions = wrapValueResolver(actionsResolver);

  return createReducer(trackingState => {
    const actions = resolveActions(trackingState);

    const resolve = (action, index) => {
      const mapContextAction = () => ({
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
