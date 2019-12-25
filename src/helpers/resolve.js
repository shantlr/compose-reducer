import { isString } from '../utils/isString';
import { isFunction } from '../utils/isFunction';

export const resolve = (resolver, trackingState, additionalMeta) => {
  return resolver(trackingState.nextState, trackingState.action, {
    prevState: trackingState.state,
    context: trackingState.context,
    ...additionalMeta
  });
};

export const wrapPathResolver = pathResolver => {
  if (pathResolver == null) {
    return () => [];
  }

  if (isString(pathResolver)) {
    return () => pathResolver.split('.');
  }
  if (Array.isArray(pathResolver)) {
    return () => pathResolver;
  }
  if (typeof pathResolver === 'number') {
    return () => [pathResolver.toString()];
  }

  if (isFunction(pathResolver)) {
    return trackingState => {
      const path = resolve(pathResolver, trackingState);
      if (isString(path)) {
        return path.split('.');
      }
      if (Array.isArray(path)) {
        return path;
      }

      throw new Error(
        `[path-resolver] Resolved path is expected to be a string or an array of string but received ${path}`
      );
    };
  }
  return null;
};

export const wrapValueResolver = valueResolver => {
  if (isFunction(valueResolver)) {
    return (trackingState, additionalMeta) =>
      resolve(valueResolver, trackingState, additionalMeta);
  }
  if (valueResolver === undefined) {
    return trackingState => trackingState.action;
  }
  return () => valueResolver;
};
