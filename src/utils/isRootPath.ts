export function isRootPath(path: ''): true;
export function isRootPath(path: []): true;
export function isRootPath(path: ['']): true;
export function isRootPath(path: string | string[]): false;
export function isRootPath(path: any): false;

export function isRootPath(path: string | string[]): boolean {
  return (
    path === '' ||
    (Array.isArray(path) &&
      (!path.length || (path.length === 1 && path[0] === '')))
  );
}
