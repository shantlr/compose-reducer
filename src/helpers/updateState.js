import { ensureNewRefInNextState, getRefKey } from './ensureNewRef';
import { initial } from '../utils/initial';
import { last } from '../utils/last';

export const updateState = (trackingState, path, value) => {
  // ensure that all parent container are new ref
  const parentPath = initial(path);
  const parentState = ensureNewRefInNextState(trackingState, parentPath);

  // as parent state container is a new ref, we can mutate
  const key = last(path);
  parentState[key] = value;

  // mark path as updated
  const refKey = getRefKey(path);
  trackingState.isNewReference[refKey] = true;

  return value;
};
