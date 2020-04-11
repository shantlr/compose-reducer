import { createReducer } from '../../helpers/createReducer';
import { resolve } from '../../helpers/resolve';
import { wrapReducers } from '../../helpers/wrapReducer';

export const branch = (predicate, trueReducers, falseReducers) => {
  const reduceTrueCase = wrapReducers(trueReducers);
  const reduceFalseCase = wrapReducers(falseReducers);

  const testPredicate = trackingState => resolve(predicate, trackingState);

  const branchReducer = trackingState => {
    if (testPredicate(trackingState)) {
      if (reduceTrueCase) {
        reduceTrueCase(trackingState);
      }
    } else if (reduceFalseCase) {
      reduceFalseCase(trackingState);
    }
  };
  return createReducer(branchReducer);
};
