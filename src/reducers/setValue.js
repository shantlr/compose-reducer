import { createReducer } from '../helpers/createReducer';
import { wrapPathResolver, wrapValueResolver } from '../helpers/resolve';
import { updateState } from '../helpers/updateState';

export const setValue = (pathResolver, valueResolver) => {
  const resolvePath = wrapPathResolver(pathResolver);
  if (!resolvePath) {
    throw new Error(
      `[setValue]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
    );
  }

  const resolveValue = wrapValueResolver(valueResolver);

  const setValueReducer = trackingState => {
    const path = resolvePath(trackingState);
    const value = resolveValue(trackingState);

    return updateState(trackingState, path, value);
  };

  return createReducer(setValueReducer);
};
