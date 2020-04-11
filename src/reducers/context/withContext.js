import { wrapValueResolver } from '../../helpers/resolve';
import { createReducer } from '../../helpers/createReducer';
import { pipe } from '../../utils/pipe';

export const withContextBase = (
  resolveAdditionalContext,
  composableReducers
) => {
  const reducer = pipe(...composableReducers);

  return createReducer(trackingState => {
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

export const withContext = (contextResolver, ...composableReducers) => {
  const valueResolver = wrapValueResolver(contextResolver);
  return withContextBase(valueResolver, composableReducers);
};
