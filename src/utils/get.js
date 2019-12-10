import { isNil } from './isNil';

export const get = (value, path) => {
  let selectedValue = value;

  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i += 1) {
      if (isNil(selectedValue)) {
        break;
      }
      const field = path[i];
      if (field !== '') {
        selectedValue = selectedValue[field];
      }
    }
  }

  return selectedValue;
};
