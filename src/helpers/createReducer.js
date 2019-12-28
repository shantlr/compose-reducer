import { pipe } from '../utils/pipe';
import { TrackingState } from './trackingState';

/**
 * Initialize tracking
 */
const initTrackingState = (state, action) => new TrackingState(state, action);

/**
 * Compose reducers
 */
export const composeReducers = (...composableReducers) => {
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
  if (!(trackingState instanceof TrackingState)) {
    throw new Error(
      'Invalid tracking state. Did you use composable-reducer without composeReducers ?'
    );
  }
  reduce(trackingState);
  return trackingState;
};
