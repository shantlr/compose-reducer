import { wrapSimpleValueResolver } from '../helpers/resolve';

export const lte = (value, other) => {
  const resolveValue = wrapSimpleValueResolver(value);
  const resolveOther = wrapSimpleValueResolver(other);

  const eqResolver = (state, action) => {
    return resolveValue(state, action) <= resolveOther(state, action);
  };
  return eqResolver;
};
