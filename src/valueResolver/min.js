import { wrapSimpleValueResolver } from '../helpers/resolve';

export const min = (...valueResolvers) => {
  const resolvers = valueResolvers.map(wrapSimpleValueResolver);

  return (state, action) => Math.min(...resolvers.map(r => r(state, action)));
};
