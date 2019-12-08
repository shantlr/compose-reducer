import { createReducer } from '../helpers/createReducer';
import { wrapPathResolver, wrapValueResolver } from '../helpers/resolve';
import { updateState } from '../helpers/updateState';
import { ensureNewRefInNextState } from '../helpers/ensureNewRef';
import { get } from '../utils/get';

export const setValueBase = (pathResolver, valueResolver, handleResult) => {
  const resolvePath = wrapPathResolver(pathResolver);
  if (!resolvePath) {
    throw new Error(
      `[setValue]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
    );
  }

  const resolveValue = wrapValueResolver(valueResolver);

  const setValueReducer = trackingState => {
    const path = resolvePath(trackingState);

    const oldValue = get(trackingState.nextState, path);
    const value = resolveValue(trackingState, { value: oldValue });

    handleResult(trackingState, path, value, oldValue);
  };

  return createReducer(setValueReducer);
};

export const setValue = (pathResolver, valueResolver) =>
  setValueBase(pathResolver, valueResolver, (trackingState, path, value) => {
    ensureNewRefInNextState(trackingState, path);
    updateState(trackingState, path, value);
  });
