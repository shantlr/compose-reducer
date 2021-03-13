import {
  wrapPathResolver,
  NO_OP,
  StaticPathOrPathResolver
} from '../../helpers/resolve';
import { withContextBase } from './withContext';
import {
  PATH_OVERRIDE_SYMBOL,
  TrackingState
} from '../../helpers/trackingState';
import { ComposableReducer } from '../../helpers/createReducer';
import { ValueAtPath } from '../../utils/get';

export const at = <State, Action>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  ...composableReducers: ComposableReducer<
    ValueAtPath<State, typeof pathResolver>,
    Action
  >[]
) => {
  const resolvePath = wrapPathResolver(pathResolver);

  const overridePath = (trackingState: TrackingState<State, Action>) => {
    const path = resolvePath(trackingState);
    if (path === NO_OP) {
      return null;
    }

    return {
      [PATH_OVERRIDE_SYMBOL]: path
    };
  };

  return withContextBase(overridePath, composableReducers);
};
