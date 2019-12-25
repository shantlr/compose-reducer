import { setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';

export const decValue = (pathResolver, valueResolver) =>
  setValueBase(
    pathResolver,
    valueResolver,
    (trackingState, path, value, oldValue) => {
      if (!isNil(value)) {
        trackingState.updateState(path, (oldValue || 0) - value);
      }
    },
    'decValue'
  );
