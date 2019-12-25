import { setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';

export const popValues = (pathResolver, indexesResolver) => {
  return setValueBase(
    pathResolver,
    indexesResolver,
    (trackingState, path, indexes, oldArray = []) => {
      if (
        isNil(indexes) ||
        indexes === -1 ||
        !oldArray ||
        (Array.isArray(indexes) && !indexes.length)
      ) {
        return;
      }

      if (oldArray && !Array.isArray(oldArray)) {
        throw new Error('[popValues] previous value is not iterable');
      }

      let indexMap;
      if (Array.isArray(indexes)) {
        indexMap = indexes.reduce((map, index) => {
          map[index] = true;
          return map;
        }, {});
      } else {
        indexMap = { [indexes]: true };
      }

      const nextArray = oldArray.filter(
        (elem, elemIndex) => !indexMap[elemIndex]
      );

      if (nextArray.length < oldArray.length) {
        trackingState.updateState(path, nextArray);
      }
    },
    'popValues'
  );
};
