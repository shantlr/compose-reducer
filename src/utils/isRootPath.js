export const isRootPath = path =>
  !path || !path.length || (path.length === 1 && path[0] === '');
