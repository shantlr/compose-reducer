import { ValueResolver, wrapSimpleValueResolver } from '../helpers/resolve';

export const array = <State, Action, Value>(
  ...values: (ValueResolver<State, Action, Value> | Value)[]
) => {
  const resolvers = values.map(v => wrapSimpleValueResolver(v));
  const arrayValueResolver: ValueResolver<State, Action, Value[]> = (
    state,
    action
  ) => {
    return resolvers.map(r => r(state, action));
  };
  return arrayValueResolver;
};
