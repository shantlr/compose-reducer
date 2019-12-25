import { isString } from '../utils/isString';
import { isFunction } from '../utils/isFunction';

export const resolve = (resolver, trackingState, additionalMeta) => {
  return resolver(trackingState.nextState, trackingState.action, {
    initialState: trackingState.initialState,
    context: trackingState.context,
    ...additionalMeta
  });
};

const relativePathResolver = (trackingState, path) => {
  return [...trackingState.getPath(), ...(path || [])];
};

const staticRelativePathResolve = path => trackingState => {
  return relativePathResolver(trackingState, path);
};

export const wrapPathResolver = pathResolver => {
  if (pathResolver == null) {
    return staticRelativePathResolve([]);
  }

  if (isString(pathResolver)) {
    return staticRelativePathResolve(pathResolver.split('.'));
  }
  if (Array.isArray(pathResolver)) {
    return staticRelativePathResolve(pathResolver);
  }
  if (typeof pathResolver === 'number') {
    return staticRelativePathResolve([pathResolver.toString()]);
  }

  if (isFunction(pathResolver)) {
    return trackingState => {
      const path = resolve(pathResolver, trackingState);
      if (isString(path)) {
        return relativePathResolver(trackingState, path.split('.'));
      }
      if (Array.isArray(path)) {
        return relativePathResolver(trackingState, path);
      }

      throw new Error(
        `[path-resolver] Resolved path is expected to be a string or an array of string but received ${path}`
      );
    };
  }

  // could not wrap path resolver
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
