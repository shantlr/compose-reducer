import { isString } from '../utils/isString';
import { isFunction } from '../utils/isFunction';

export const resolve = (resolver, trackingState) => {
  return resolver(trackingState.nextState, trackingState.action, {
    prevState: trackingState.state,
    context: trackingState.context
  });
};

export const wrapPathResolver = pathResolver => {
  if (isString(pathResolver)) {
    return () => pathResolver.split('.');
  }
  if (Array.isArray(pathResolver)) {
    return () => pathResolver;
  }
  if (isFunction(pathResolver)) {
    return trackingState => resolve(pathResolver, trackingState);
  }
  return null;
};

export const wrapValueResolver = valueResolver => {
  if (isFunction(valueResolver)) {
    return trackingState => resolve(valueResolver, trackingState);
  }
  return () => valueResolver;
};
