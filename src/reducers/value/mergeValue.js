import { setValueBase } from './setValue';

export const mergeValue = (pathResolver, valueResolver) => {
  const setValueHandler = (trackingState, path, value, oldValue) => {
    if (!value) {
      return;
    }

    trackingState.updateState(path, {
      ...(oldValue || null),
      ...value
    });
  };

  return setValueBase(
    pathResolver,
    valueResolver,
    setValueHandler,
    'mergeValue'
  );
};
