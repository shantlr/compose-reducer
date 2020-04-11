export const isRootPath = path =>
  path === '' ||
  (Array.isArray(path) &&
    (!path.length || (path.length === 1 && path[0] === '')));
