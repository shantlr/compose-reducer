import { BaseSetValueHandler, setValueBase } from './setValue';
import { isNil } from '../../utils/isNil';
import {
  StaticOrValueResolverWithContext,
  StaticPathOrPathResolver
} from '../../helpers/resolve';
import { ValueAtPath } from '../../utils/get';

export const incValue = <State, Action>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  valueResolver: StaticOrValueResolverWithContext<State, Action, number>
) => {
  const incValueHandler: BaseSetValueHandler<
    State,
    Action,
    number,
    ValueAtPath<State, typeof pathResolver>
  > = (trackingState, path, value, oldValue) => {
    if (!isNil(value)) {
      trackingState.updateState(path, ((oldValue as number) || 0) + value);
    }
  };

  return setValueBase(pathResolver, valueResolver, incValueHandler, 'incValue');
};
