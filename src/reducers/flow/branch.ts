import { ComposableReducer, createReducer } from '../../helpers/createReducer';
import {
  resolveValueWithContext,
  ValueResolverWithContext
} from '../../helpers/resolve';
import { TrackingState } from '../../helpers/trackingState';

export const branch = <State, Action>(
  predicate: ValueResolverWithContext<State, Action, boolean>,
  trueReducer: undefined | null | ComposableReducer<State, Action>,
  falseReducer?: ComposableReducer<State, Action>
) => {
  const testPredicate = (trackingState: TrackingState<State, Action>) =>
    resolveValueWithContext(predicate, trackingState);

  const branchReducer = (trackingState: TrackingState<State, Action>) => {
    if (testPredicate(trackingState)) {
      if (trueReducer) {
        trueReducer(trackingState);
      }
    } else if (falseReducer) {
      falseReducer(trackingState);
    }
  };
  return createReducer(branchReducer);
};
