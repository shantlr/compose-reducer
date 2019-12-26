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

    actions.forEach((action, index) => {
      withContextBase(
        () => ({
          [ACTION_OVERRIDE_SYMBOL]: action,
          actionIndex: index
        }),
        composableReducers
      )(trackingState);
    });
  });
};
