import {
  StaticOrValueResolver,
  ValueResolver,
  wrapSimpleValueResolver
} from '../helpers/resolve';

export const min = <State, Action>(
  ...valueResolvers: StaticOrValueResolver<State, Action, number>[]
): ValueResolver<State, Action, number> => {
  const resolvers = valueResolvers.map(wrapSimpleValueResolver);

  return (state, action) => Math.min(...resolvers.map(r => r(state, action)));
};

min(() => 1, 5);
