import { wrapSimpleValueResolver } from '../helpers/resolve';

export const max = (...valueResolvers) => {
  const resolvers = valueResolvers.map(wrapSimpleValueResolver);

  return (state, action) => Math.max(...resolvers.map(r => r(state, action)));
};
