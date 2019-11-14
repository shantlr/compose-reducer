import { setValueBase } from './setValue';
import { updateState } from '../helpers/updateState';

export const pushValues = (pathResolver, valuesResolver) => {
  return setValueBase(
    pathResolver,
    valuesResolver,
    (trackingState, path, values, oldValues) => {
      if (!oldValues || !oldValues.length) {
        return;
      }

      updateState(trackingState, path, [...oldValues, ...values]);
    }
  );
};

export const pushValue = (pathResolver, valueResolver) => {
  return setValueBase(
    pathResolver,
    valueResolver,
    (trackingState, path, value, oldValues) => {
      updateState(trackingState, path, [...oldValues, value]);
    }
  );
};
