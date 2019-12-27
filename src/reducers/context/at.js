import { wrapPathResolver } from '../../helpers/resolve';
import { withContextBase } from './withContext';
import { PATH_OVERRIDE_SYMBOL } from '../../helpers/trackingState';

export const at = (pathResolver, ...composableReducers) => {
  const resolvePath = wrapPathResolver(pathResolver);

  return withContextBase(
    trackingState => ({
      [PATH_OVERRIDE_SYMBOL]: resolvePath(trackingState)
    }),
    composableReducers
  );
};
