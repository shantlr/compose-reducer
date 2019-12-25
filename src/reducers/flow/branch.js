import { createReducer } from '../../helpers/createReducer';
import { resolve } from '../../helpers/resolve';
import { wrapReducers } from '../../helpers/wrapReducer';

export const branch = (predicate, trueReducers, falseReducers) => {
  const reduceTrueCase = wrapReducers(trueReducers);
  const reduceFalseCase = wrapReducers(falseReducers);

  const test = trackingState => resolve(predicate, trackingState);

  return createReducer(trackingState => {
    if (test(trackingState)) {
      if (reduceTrueCase) {
        reduceTrueCase(trackingState);
      }
    } else if (reduceFalseCase) {
      reduceFalseCase(trackingState);
    }
  });
};
