import {
  StaticOrValueResolver,
  ValueResolver,
  wrapSimpleValueResolver
} from '../helpers/resolve';

export const max = <State, Action>(
  ...valueResolvers: StaticOrValueResolver<State, Action, number>[]
): ValueResolver<State, Action, number> => {
  const resolvers = valueResolvers.map(wrapSimpleValueResolver);

  return (state, action) => Math.max(...resolvers.map(r => r(state, action)));
};