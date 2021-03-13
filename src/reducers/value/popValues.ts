import { BaseSetValueHandler, setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';
import {
  StaticOrValueResolverWithContext,
  StaticPathOrPathResolver
} from '../../helpers/resolve';
import { ValueAtPath } from '../../utils/get';

export const popValues = <State, Action>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  indexesResolver: StaticOrValueResolverWithContext<
    State,
    Action,
    number | number[]
  >
) => {
  const popValuesHandler: BaseSetValueHandler<
    State,
    Action,
    number | number[],
    ValueAtPath<State, typeof pathResolver>
  > = (trackingState, path, indexes, oldArray) => {
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
    const prevArray = (oldArray as any[]) || [];

    let indexMap: { [key: number]: true };
    if (Array.isArray(indexes)) {
      indexMap = indexes.reduce((map, index) => {
        map[index] = true;
        return map;
      }, {});
    } else {
      indexMap = { [indexes]: true };
    }

    const nextArray = prevArray.filter(
      (elem, elemIndex) => !indexMap[elemIndex]
    );

    if (nextArray.length < prevArray.length) {
      trackingState.updateState(path, nextArray);
    }
  };

  return setValueBase(
    pathResolver,
    indexesResolver,
    popValuesHandler,
    'popValues'
  );
};
