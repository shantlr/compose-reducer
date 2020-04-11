import { setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';

export const incValue = (pathResolver, valueResolver) => {
  const incValueHandler = (trackingState, path, value, oldValue) => {
    if (!isNil(value)) {
      trackingState.updateState(path, value + (oldValue || 0));
    }
  };

  return setValueBase(pathResolver, valueResolver, incValueHandler, 'incValue');
};
