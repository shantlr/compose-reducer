import { get } from '../utils/get';

export const getAction = path => {
  const p = Array.isArray(path) ? path : path.split('.');
  return (state, action) => get(action, p);
};
