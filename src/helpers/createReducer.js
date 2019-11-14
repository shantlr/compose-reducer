import { pipe } from '../utils/pipe';

/**
 * Initialize tracking
 */
const initTrackingState = (state, action) => ({
  state,
  nextState: state,
  action,
  isNewReference: {},
  context: {}
});

/**
 * Compose reducers
 */
export const composeReducer = (...composableReducers) => {
  return pipe(
    initTrackingState,
    ...composableReducers,
    trackingState => trackingState.nextState // last step: extract computed next state
  );
};

export const createReducer = reduce => trackingState => {
  reduce(trackingState);
  return trackingState;
};
