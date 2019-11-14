import { setValueBase } from './setValue';
import { updateState } from '../helpers/updateState';

export const popValues = (pathResolver, indexesResolver) => {
  return setValueBase(
    pathResolver,
    indexesResolver,
    (trackingState, path, indexes, oldArray) => {
      if (!indexes || !indexes.length) {
        return;
      }
      const indexMap = indexes.reduce((map, index) => {
        map[index] = true;
        return map;
      }, {});

      const nextArray = oldArray.filter(
        (elem, elemIndex) => indexMap[elemIndex]
      );

      if (nextArray.length < oldArray.length) {
        updateState(trackingState, path, nextArray);
      }
    }
  );
};

export const popValue = (pathResolver, indexResolver) => {
  return setValueBase(
    pathResolver,
    indexResolver,
    (trackingState, path, index, oldValues) => {
      if (index === -1 || !oldValues || oldValues.length - 1 < index) {
        return;
      }

      const nextArray = oldValues.filter(
        (elem, elemIndex) => elemIndex !== index
      );
      updateState(trackingState, path, nextArray);
    }
  );
};
