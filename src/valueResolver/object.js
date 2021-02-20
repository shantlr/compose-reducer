import { isFunction } from '../utils/isFunction';

export const object = objFieldResolvers => {
  const base = {};
  const resolvers = [];

  Object.keys(objFieldResolvers).forEach(key => {
    const fieldValue = objFieldResolvers[key];
    if (isFunction(fieldValue)) {
      resolvers.push((result, state, action) => {
        result[key] = fieldValue(state, action);
      });
    } else {
      base[key] = fieldValue;
    }
  });

  if (!resolvers.length) {
    const staticObjectResolver = () => base;
    return staticObjectResolver;
  }

  const objectResolver = (state, action) => {
    const result = { ...base };
    resolvers.forEach(r => {
      r(result, state, action);
    });
    return result;
  };
  return objectResolver;
};
