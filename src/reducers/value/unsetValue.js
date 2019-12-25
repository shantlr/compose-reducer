import { createReducer } from '../../helpers/createReducer';
import { wrapPathResolver } from '../../helpers/resolve';

export const unsetValue = pathResolver => {
  const resolvePath = wrapPathResolver(pathResolver);

  if (!resolvePath) {
    throw new Error(
      `[unsetValue]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
    );
  }

  const unsetValueReducer = trackingState => {
    const path = resolvePath(trackingState);
    return trackingState.unsetState(path);
  };

  return createReducer(unsetValueReducer);
};
