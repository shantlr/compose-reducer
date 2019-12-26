export const isRootPath = path =>
  (!path && path !== 0) ||
  (Array.isArray(path) &&
    (!path.length || (path.length === 1 && path[0] === '')));
