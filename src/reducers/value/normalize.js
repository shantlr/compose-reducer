import { setValueBase } from './setValue';
import { updateState } from '../../helpers/updateState';
import { pipe } from '../../utils/pipe';

// export const normalizeBase = ({
//   entityPathResolver,
//   idsPathResolver,
//   normalizedValueResolver
// }) => { };

const defaultNormalizeMerger = (oldValues, newValues) => {
  return {
    ...oldValues,
    ...newValues
  };
};

export const normalize = ({
  entityPath,
  idsPath,
  normalizedValueResolver,
  merger = defaultNormalizeMerger,
  nesteds = []
}) => {
  if (nesteds.length > 0) {
    Object.keys(normalizedValue).forEach(key => {
      nestedResolvers({
        ...trackingState,
        action: normalizedValue[key]
      });
    });
  }
};

normalize('itemDocs', (state, action) => action.payload.aze);
