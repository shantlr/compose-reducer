import { setValueBase } from './setValue';
import { isNil } from '../utils/isNil';
import { updateState } from '../helpers/updateState';

export const decValue = (pathResolver, valueResolver) =>
  setValueBase(
    pathResolver,
    valueResolver,
    (trackingState, path, value, oldValue) => {
      if (!isNil(value)) {
        updateState(trackingState, path, (oldValue || 0) - value);
      }
    }
  );
