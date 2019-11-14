export const shallowClone = value => {
  if (Array.isArray(value)) {
    return [...value];
  }
  return { ...value };
};
