import { get } from '../utils/get';
import { shallowClone } from '../utils/shallowClone';
import { last } from '../utils/last';
import { initial } from '../utils/initial';

export const getRefKey = (path = []) => path.join('.');

// ensure that given path is a new reference
// and return the substate correponding to the path
export const ensureNewRefInNextState = (trackingState, path = []) => {
  const refKey = getRefKey(path);

  // if is already a new ref => return as is
  if (trackingState.isNewReference[refKey]) {
    return get(trackingState.nextState, path);
  }

  trackingState.isNewReference[refKey] = true;

  // state root case
  if (!path || !path.length) {
    // new ref of state
    trackingState.nextState = shallowClone(trackingState.nextState);
    return trackingState.nextState;
  }

  // sub field case
  const parentPath = initial(path);
  const parentState = ensureNewRefInNextState(trackingState, parentPath);
  const key = last(path);

  // and create a new ref of field
  // in case field was an array => copy as array else as object
  parentState[key] = shallowClone(parentState[key]);

  return parentState[key];
};
