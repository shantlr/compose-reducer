import {
  StaticOrValueResolver,
  ValueResolver,
  wrapSimpleValueResolver
} from '../helpers/resolve';

export const eq = <State, Action, Value>(
  value: StaticOrValueResolver<State, Action, Value>,
  other: StaticOrValueResolver<State, Action, Value>
): ValueResolver<State, Action, boolean> => {
  const resolveValue = wrapSimpleValueResolver(value);
  const resolveOther = wrapSimpleValueResolver(other);

  const eqResolver = (state: State, action: Action) => {
    return resolveValue(state, action) === resolveOther(state, action);
  };
  return eqResolver;
};
