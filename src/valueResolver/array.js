import { wrapSimpleValueResolver } from '../helpers/resolve';

export const array = (...values) => {
  const resolvers = values.map(v => wrapSimpleValueResolver(v));
  const arrayValueResolver = (state, action) => {
    return resolvers.map(r => r(state, action));
  };
  return arrayValueResolver;
};
