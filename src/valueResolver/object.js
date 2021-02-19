import { wrapSimpleValueResolver } from '../helpers/resolve';

export const object = objFieldResolvers => {
  const fieldResolvers = Object.keys(objFieldResolvers).map(key => {
    const resolver = wrapSimpleValueResolver(objFieldResolvers[key]);
    return (result, state, action) => {
      result[key] = resolver(state, action);
    };
  });

  const objectResolver = (state, action) => {
    const result = {};
    fieldResolvers.forEach(r => {
      r(result, state, action);
    });
    return result;
  };
  return objectResolver;
};
