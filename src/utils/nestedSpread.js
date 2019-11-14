import { isNil } from './isNil';

export const nestedSpread = (state, path, objToSpread) => {
  if (!path || !path.length) {
    return {
      ...state,
      ...objToSpread
    };
  }

  const [key, ...pathTail] = path;

  return {
    ...state,
    [key]: nestedSpread(isNil(state) ? null : state[key], pathTail, objToSpread)
  };
};
