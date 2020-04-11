import { createReducer } from '../../helpers/createReducer';
import { wrapPathResolver, wrapValueResolver } from '../../helpers/resolve';
import { get } from '../../utils/get';

export const setValueBase = (
  pathResolver,
  valueResolver,
  handleResult,
  fnName = 'setValueBase'
) => {
  const resolvePath = wrapPathResolver(pathResolver);
  if (!resolvePath) {
    throw new Error(
      `[${fnName}]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
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

export const setValue = (pathResolver, valueResolver) => {
  const setValueHandler = (trackingState, path, value) => {
    trackingState.updateState(path, value);
  };

  return setValueBase(pathResolver, valueResolver, setValueHandler, 'setValue');
};
