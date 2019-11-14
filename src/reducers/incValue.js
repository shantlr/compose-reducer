import { setValueBase } from './setValue';
import { isNil } from '../utils/isNil';
import { updateState } from '../helpers/updateState';

export const incValue = (pathResolver, valueResolver) =>
  setValueBase(
    pathResolver,
    valueResolver,
    (trackingState, path, value, oldValue) => {
      if (!isNil(value)) {
        updateState(trackingState, path, value + (oldValue || 0));
      }
    }
  );
