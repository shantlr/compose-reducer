import { initial } from '../utils/initial';
import { last } from '../utils/last';

export const compute = (...resolvers) => {
  if (!resolvers.length) {
    return () => undefined;
  }

  const argResolvers = initial(resolvers);
  const valueResolver = last(resolvers);
  return (...args) => {
    const resolvedArgs = argResolvers.map(r => r(...args));
    return valueResolver(...resolvedArgs);
  };
};
