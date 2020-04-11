import { wrapPathResolver, NO_OP } from '../../helpers/resolve';
import { withContextBase } from './withContext';
import { PATH_OVERRIDE_SYMBOL } from '../../helpers/trackingState';

export const at = (pathResolver, ...composableReducers) => {
  const resolvePath = wrapPathResolver(pathResolver);

  const overridePath = trackingState => {
    const path = resolvePath(trackingState);
    if (path === NO_OP) {
      return null;
    }

    return {
      [PATH_OVERRIDE_SYMBOL]: path
    };
  };

  return withContextBase(overridePath, composableReducers);
};
