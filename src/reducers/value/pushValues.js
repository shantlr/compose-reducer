import { setValueBase } from './setValue';
import { resolve } from '../../helpers/resolve';
import { isIterable } from '../../utils/isIterable';

const lastIndexResolver = (state, action, context, { oldValues }) => {
  if (oldValues) {
    return oldValues.length || 0;
  }
  return 0;
};

export const pushValues = (
  pathResolver,
  valuesResolver,
  indexResolver = lastIndexResolver
) => {
  const pushValuesHandler = (trackingState, path, values, oldValues) => {
    if (!values || !values.length) {
      return;
    }

    if (!oldValues || isIterable(oldValues)) {
      const index = resolve(indexResolver, trackingState, { oldValues });

      const nextValue = [...(oldValues || [])];
      nextValue.splice(index, 0, ...values);

      trackingState.updateState(path, nextValue);
    } else {
      throw new Error(
        `[pushValues] previous value is not iterable ${oldValues}`
      );
    }
  };

  return setValueBase(
    pathResolver,
    valuesResolver,
    pushValuesHandler,
    'pushValues'
  );
};

export const pushValue = (
  pathResolver,
  valueResolver,
  indexResolver = lastIndexResolver
) => {
  const pushValueHandler = (trackingState, path, value, oldValues) => {
    if (!oldValues || isIterable(oldValues)) {
      const index = resolve(indexResolver, trackingState, { oldValues });

      const nextValue = [...(oldValues || [])];
      nextValue.splice(index, 0, value);

      trackingState.updateState(path, nextValue);
    } else {
      throw new Error(
        `[pushValue] previous value is not iterable ${oldValues}`
      );
    }
  };

  return setValueBase(
    pathResolver,
    valueResolver,
    pushValueHandler,
    'pushValue'
  );
};
