import { isString } from '../utils/isString';
import { isFunction } from '../utils/isFunction';
import { isRootPath } from '../utils/isRootPath';
import { get } from '../utils/get';
import { isNumber } from '../utils/isNumber';
import { isNil } from '../utils/isNil';

export const NO_OP = Symbol('no_op: resolved path is nil');
export const resolveNoOp = () => NO_OP;

const resolveRelativePath = (trackingState, path) => {
  return [...trackingState.getPath(), ...(path || [])];
};

const staticRelativePathResolve = path => {
  const staticRelativePathResolver = trackingState =>
    resolveRelativePath(trackingState, path);
  return staticRelativePathResolver;
};

export const resolve = (resolver, trackingState, additionalMeta) => {
  return resolver(
    get(trackingState.nextState, resolveRelativePath(trackingState)),
    trackingState.action,
    trackingState.context,
    {
      initialState: trackingState.initialState,
      ...additionalMeta
    }
  );
};

export const wrapPathResolver = pathResolver => {
  if (isNil(pathResolver)) {
    return resolveNoOp;
  }

  // static array path
  if (Array.isArray(pathResolver)) {
    return staticRelativePathResolve(pathResolver);
  }

  if (isRootPath(pathResolver)) {
    return staticRelativePathResolve([]);
  }

  // static string path
  if (isString(pathResolver)) {
    return staticRelativePathResolve(pathResolver.split('.'));
  }

  // static number path
  if (isNumber(pathResolver)) {
    return staticRelativePathResolve([pathResolver]);
  }

  // dynamic resolver
  if (isFunction(pathResolver)) {
    return trackingState => {
      const path = resolve(pathResolver, trackingState);

      if (isNil(path)) {
        return NO_OP;
      }

      if (Array.isArray(path)) {
        return resolveRelativePath(trackingState, path);
      }
      if (isRootPath(path)) {
        return resolveRelativePath(trackingState, []);
      }
      if (isString(path)) {
        return resolveRelativePath(trackingState, path.split('.'));
      }
      if (isNumber(path)) {
        return resolveRelativePath(trackingState, [path]);
      }

      throw new Error(
        `[path-resolver] Resolved path is expected to be a string or an array of string but received ${path}`
      );
    };
  }

  // could not wrap path resolver
  return null;
};

const actionAsValueResolver = trackingState => trackingState.action;
export const wrapValueResolver = valueResolver => {
  if (isFunction(valueResolver)) {
    const dynamicValueResolver = (trackingState, additionalMeta) =>
      resolve(valueResolver, trackingState, additionalMeta);
    return dynamicValueResolver;
  }
  if (valueResolver === undefined) {
    return actionAsValueResolver;
  }

  const staticValueResolver = () => valueResolver;
  return staticValueResolver;
};
