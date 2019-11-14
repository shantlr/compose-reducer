import { ensureNewRefInNextState } from './ensureNewRef';
import { initial } from '../utils/initial';
import { last } from '../utils/last';
import { has } from '../utils/has';

export const unsetState = (trackingState, path) => {
  const parentPath = initial(path);

  if (!has(trackingState.nextState, path)) {
    return;
  }

  // ensure that all parent container are new ref
  const parentState = ensureNewRefInNextState(trackingState, parentPath);

  // as parent state container is a new ref, we can mutate
  const key = last(path);
  delete parentState[key];
};
