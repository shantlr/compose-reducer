import {
  StaticOrValueResolver,
  ValueResolver,
  wrapSimpleValueResolver
} from '../helpers/resolve';

export const gte = <State, Action>(
  value: StaticOrValueResolver<State, Action, number>,
  other: StaticOrValueResolver<State, Action, number>
): ValueResolver<State, Action, boolean> => {
  const resolveValue = wrapSimpleValueResolver(value);
  const resolveOther = wrapSimpleValueResolver(other);

  const eqResolver = (state: State, action: Action) => {
    return resolveValue(state, action) >= resolveOther(state, action);
  };
  return eqResolver;
};
