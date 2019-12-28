import { withContextBase } from './withContext';
import { wrapValueResolver } from '../../helpers/resolve';
import { ACTION_OVERRIDE_SYMBOL } from '../../helpers/trackingState';
import { createReducer } from '../../helpers/createReducer';

export const withAction = (actionResolver, ...composableReducers) => {
  const valueResolver = wrapValueResolver(actionResolver);
  return withContextBase(
    trackingState => ({
      [ACTION_OVERRIDE_SYMBOL]: valueResolver(trackingState)
    }),
    composableReducers
  );
};

export const withActions = (actionsResolver, ...composableReducers) => {
  const resolveActions = wrapValueResolver(actionsResolver);

  return createReducer(trackingState => {
    const actions = resolveActions(trackingState);

    const resolve = (action, index) =>
      withContextBase(
        () => ({
          [ACTION_OVERRIDE_SYMBOL]: action,
          actionKey: index
        }),
        composableReducers
      )(trackingState);

    if (Array.isArray(actions)) {
      actions.forEach(resolve);
    } else if (typeof actions === 'object') {
      Object.keys(actions).forEach(key => {
        resolve(actions[key], key);
      });
    }
  });
};
