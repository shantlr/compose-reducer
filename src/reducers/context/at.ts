import {
  wrapPathResolver,
  NO_OP,
  StaticOrValueResolver
} from '../../helpers/resolve';
import { withContextBase } from './withContext';
import {
  PATH_OVERRIDE_SYMBOL,
  TrackingState
} from '../../helpers/trackingState';
import { ComposableReducer } from '../../helpers/createReducer';
import { PathElem, ValueAtPath } from '../../utils/get';

export const at = <
  State,
  Action,
  P extends PathElem | PathElem[]
  // U extends ValueAtPath<State, P> = ValueAtPath<State, P>
>(
  pathResolver: StaticOrValueResolver<State, Action, P>,
  ...composableReducers: ComposableReducer<ValueAtPath<State, P>, Action>[]
): // pathResolver: StaticPathOrPathResolver<State, Action>,
// ...composableReducers: ComposableReducer<ValueAtPath<State, P>, Action>[]
ComposableReducer<State, Action> => {
  const resolvePath = wrapPathResolver(pathResolver);

  const overridePath = (trackingState: TrackingState<State, Action>) => {
    const path = resolvePath(trackingState) as P | typeof NO_OP;
    if (path === NO_OP) {
      return null;
    }

    return {
      [PATH_OVERRIDE_SYMBOL]: path
    };
  };

  return withContextBase(overridePath, composableReducers);
};
