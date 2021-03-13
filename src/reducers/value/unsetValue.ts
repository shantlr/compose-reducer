import { createReducer } from '../../helpers/createReducer';
import {
  wrapPathResolver,
  NO_OP,
  StaticPathOrPathResolver
} from '../../helpers/resolve';
import { TrackingState } from '../../helpers/trackingState';

export const unsetValue = <State, Action>(
  pathResolver: StaticPathOrPathResolver<State, Action>
) => {
  const resolvePath = wrapPathResolver(pathResolver);

  if (!resolvePath) {
    throw new Error(
      `[unsetValue]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
    );
  }

  const unsetValueReducer = (trackingState: TrackingState<State, Action>) => {
    const path = resolvePath(trackingState);
    if (path === NO_OP) {
      return;
    }
    trackingState.unsetState(path);
  };

  return createReducer(unsetValueReducer);
};
