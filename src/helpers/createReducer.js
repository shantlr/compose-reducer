import { pipe } from '../utils/pipe';
import { TrackingState } from './trackingState';

/**
 * Initialize tracking
 */
const initTrackingState = (state, action) => new TrackingState(state, action);

const extractStateFromTrackingState = trackingState => trackingState.nextState;
/**
 * Compose reducers
 */
export const composeReducer = (...composableReducers) => {
  return pipe(
    initTrackingState,
    ...composableReducers,
    extractStateFromTrackingState // last step: extract computed next state
  );
};

/**
 * Create a tracking state given reducer
 */
export const createReducer = reduce => trackingState => {
  if (!(trackingState instanceof TrackingState)) {
    throw new Error(
      'Invalid tracking state. Did you use composable-reducer without composeReducer ?'
    );
  }
  reduce(trackingState);
  return trackingState;
};
