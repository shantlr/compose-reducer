import { get } from '../utils/get';
import { ensureNewRefInNextState } from './ensureNewRef';
import { initial } from '../utils/initial';
import { last } from '../utils/last';
import { isNil } from '../utils/isNil';

export const unsetState = (handyState, path) => {
  const parentPath = initial(path);

  const parent = get(handyState.nextState, parentPath);
  if (isNil(parent)) {
    return;
  }

  // ensure that all parent container are new ref
  const parentState = ensureNewRefInNextState(handyState, parentPath);

  // as parent state container is a new ref, we can mutate
  const key = last(path);
  delete parentState[key];
};
