import { withContextBase } from './withContext';
import { wrapValueResolver } from '../../helpers/resolve';
import { ACTION_OVERRIDE_SYMBOL } from '../../helpers/trackingState';

export const withAction = (actionResolver, ...composableReducers) => {
  const valueResolver = wrapValueResolver(actionResolver);
  return withContextBase(
    trackingState => ({
      [ACTION_OVERRIDE_SYMBOL]: valueResolver(trackingState)
    }),
    composableReducers
  );
};
