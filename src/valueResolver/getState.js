import { createReducer } from '../helpers/createReducer';
import { get } from '../utils/get';

export const getState = path => {
  const p = Array.isArray(path) ? path : path.split('.');
  return state => get(state, p);
};
