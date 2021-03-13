import {
  StaticOrValueResolver,
  wrapValueResolver
} from '../../helpers/resolve';
import { ComposableReducer, createReducer } from '../../helpers/createReducer';
import { pipe } from '../../utils/pipe';
import {
  ACTION_OVERRIDE_SYMBOL,
  PATH_OVERRIDE_SYMBOL,
  TrackingState
} from '../../helpers/trackingState';
import { ValueAtPath } from '../../utils/get';

type OverridedAction<Action, Context> = Context extends {
  [ACTION_OVERRIDE_SYMBOL]: infer U;
}
  ? U
  : Action;
type OverrideableState<State, Context> = Context extends {
  [PATH_OVERRIDE_SYMBOL]: infer U;
}
  ? ValueAtPath<State, U>
  : State;

export const withContextBase = <
  State,
  Action,
  Context extends {
    [key: string]: any;
    [ACTION_OVERRIDE_SYMBOL]?: any;
    [PATH_OVERRIDE_SYMBOL]?: any;
  }
>(
  resolveAdditionalContext: (
    trackingState: TrackingState<State, Action>
  ) => Context,
  composableReducers: ComposableReducer<
    OverrideableState<State, Context>,
    OverridedAction<Action, Context>
  >[]
): ComposableReducer<State, Action> => {
  const reducer = pipe(...composableReducers);

  return createReducer<State, Action>(trackingState => {
    const additionnalContext = resolveAdditionalContext(trackingState);

    if (!additionnalContext) {
      return;
    }

    const oldContext = trackingState.context;

    // new context
    trackingState.context = { ...oldContext, ...additionnalContext };

    reducer(trackingState);

    // rollback context
    trackingState.context = oldContext;
  });
};

export const withContext = <State, Action, Context>(
  contextResolver: StaticOrValueResolver<State, Action, Context>,
  ...composableReducers: ComposableReducer<
    OverrideableState<State, Context>,
    OverridedAction<Action, Context>
  >[]
) => {
  const valueResolver = wrapValueResolver(contextResolver);
  return withContextBase(valueResolver, composableReducers);
};
