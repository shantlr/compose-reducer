import { setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';

export const incValue = (pathResolver, valueResolver) =>
  setValueBase(
    pathResolver,
    valueResolver,
    (trackingState, path, value, oldValue) => {
      if (!isNil(value)) {
        trackingState.updateState(path, value + (oldValue || 0));
      }
    },
    'incValue'
  );
