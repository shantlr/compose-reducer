import { ensureNewRefInNextState } from './ensureNewRef';
import { initial } from '../utils/initial';
import { last } from '../utils/last';
import { isRootPath } from '../utils/isRootPath';

export const updateState = (trackingState, path, value) => {
  // ensure that all parent container are new ref
  const parentPath = initial(path);
  const parentState = ensureNewRefInNextState(trackingState, parentPath);

  if (isRootPath(path)) {
    // nil path => update root
    trackingState.nextState = value;
  } else {
    // as parent state container is a new ref, we can mutate
    const key = last(path);
    parentState[key] = value;
  }

  return value;
};
