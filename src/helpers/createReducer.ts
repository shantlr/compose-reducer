import { pipe } from '../utils/pipe';
import { TrackingState } from './trackingState';

/**
 * Initialize tracking
 */
const initTrackingState = <State, Action>(state: State, action: Action) =>
  new TrackingState(state, action);

const extractStateFromTrackingState = <State, Action>(
  trackingState: TrackingState<State, Action>
) => trackingState.nextState;

export type ComposableReducer<State, Action> = (
  trackingState: TrackingState<State, Action>
) => TrackingState<State, Action>;

/**
 * Compose reducers
 */
export const composeReducer = <State, Action>(
  ...composableReducers: ((
    trackingState: TrackingState<State, Action>
  ) => TrackingState<State, Action>)[]
): ((state: State | undefined | null, action: Action) => State) => {
  return pipe(
    initTrackingState,
    ...composableReducers,
    extractStateFromTrackingState // last step: extract computed next state
  );
};

/**
 * Create a tracking state given reducer
 */
export const createReducer = <State, Action>(
  reduce: (trackingState: TrackingState<State, Action>) => void
): ComposableReducer<State, Action> => trackingState => {
  if (!(trackingState instanceof TrackingState)) {
    throw new Error(
      'Invalid tracking state. Did you use composable-reducer without composeReducer ?'
    );
  }
  reduce(trackingState);
  return trackingState;
};
