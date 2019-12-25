import { pipe } from '../utils/pipe';
import { TrackingState } from './trackingState';

/**
 * Initialize tracking
 */
const initTrackingState = (state, action) => new TrackingState(state, action);

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

/**
 * Create a tracking state given reducer
 */
export const createReducer = reduce => trackingState => {
  reduce(trackingState);
  return trackingState;
};
