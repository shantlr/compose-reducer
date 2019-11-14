import { pipe } from '../utils/pipe';

export const wrapReducers = reducers => {
  if (Array.isArray(reducers)) {
    return pipe(reducers);
  }
  return reducers;
};
