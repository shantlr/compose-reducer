import { BaseSetValueHandler, setValueBase } from './setValue';
import {
  StaticOrValueResolverWithContext,
  StaticPathOrPathResolver,
  wrapValueResolver
} from '../../helpers/resolve';
import { Context } from '../../helpers/trackingState';
import { ValueAtPath } from '../../utils/get';

const lastIndexResolver = <State, Action>(
  state: State,
  action: Action,
  context: Context<Action>,
  { oldValues }: any
): number => {
  if (oldValues) {
    return oldValues.length || 0;
  }
  return 0;
};

/**
 * Push array of elements at resolved path
 */
export const pushValues = <State, Action, Values extends any[]>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  valuesResolver: StaticOrValueResolverWithContext<State, Action, Values>,
  indexResolver: StaticOrValueResolverWithContext<
    State,
    Action,
    number
  > = lastIndexResolver
) => {
  const resolveIndex = wrapValueResolver(indexResolver);

  const pushValuesHandler: BaseSetValueHandler<
    State,
    Action,
    Values,
    ValueAtPath<State, typeof pathResolver>
  > = (trackingState, path, values, oldValues) => {
    if (!values || (Array.isArray(values) && !values.length)) {
      return;
    }

    if (!oldValues || Array.isArray(oldValues)) {
      const index = resolveIndex(trackingState, {
        oldValues
      });

      const nextValue = [...((oldValues as any[]) || [])];
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

/**
 * Push an element at resolved path
 */
export const pushValue = <State, Action, Value>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  valueResolver: StaticOrValueResolverWithContext<State, Action, Value>,
  indexResolver: StaticOrValueResolverWithContext<
    State,
    Action,
    number
  > = lastIndexResolver
) => {
  const resolveIndex = wrapValueResolver(indexResolver);

  const pushValueHandler: BaseSetValueHandler<
    State,
    Action,
    Value,
    ValueAtPath<State, typeof pathResolver>
  > = (trackingState, path, value, oldValues) => {
    if (!oldValues || Array.isArray(oldValues)) {
      const index = resolveIndex(trackingState, {
        oldValues
      });

      const nextValue = [...((oldValues as any[]) || [])];
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
