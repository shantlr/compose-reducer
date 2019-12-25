import { wrapPathResolver } from '../../helpers/resolve';
import { withContextBase } from './withContext';
import { ACTION_OVERRIDE_SYMBOL } from '../../helpers/trackingState';

export const at = (pathResolver, ...composableReducers) => {
  const resolvePath = wrapPathResolver(pathResolver);

  return withContextBase(
    trackingState => ({
      [ACTION_OVERRIDE_SYMBOL]: [
        ...trackingState.getPath(),
        ...resolvePath(trackingState)
      ]
    }),
    composableReducers
  );
};
