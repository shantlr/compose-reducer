import {
  StaticOrValueResolverWithContext,
  wrapValueResolver
} from '../../helpers/resolve';
import { withContextBase } from '../context/withContext';
import { isString } from '../../utils/isString';
import { pipe } from '../../utils/pipe';
import { ComposableReducer, createReducer } from '../../helpers/createReducer';

const CONTEXT_PREDICATE_FIELD = Symbol('PREDICATE_VALUE');

export const ifTrue = <State, Action>(
  contextFieldName: string | ComposableReducer<State, Action>,
  ...composableReducers: ComposableReducer<State, Action>[]
): ComposableReducer<State, Action> => {
  let field: string | typeof CONTEXT_PREDICATE_FIELD = CONTEXT_PREDICATE_FIELD;

  if (isString(contextFieldName)) {
    field = contextFieldName;
  } else {
    composableReducers.unshift(contextFieldName);
  }

  const reducer = pipe(...composableReducers);
  return createReducer<State, Action>(trackingState => {
    if (trackingState.context[field as any]) {
      reducer(trackingState);
    }
  });
};

export const ifFalse = <State, Action>(
  contextFieldName: string | ComposableReducer<State, Action>,
  ...composableReducers: ComposableReducer<State, Action>[]
): ComposableReducer<State, Action> => {
  let field: string | typeof CONTEXT_PREDICATE_FIELD = CONTEXT_PREDICATE_FIELD;

  if (isString(contextFieldName)) {
    field = contextFieldName;
  } else {
    composableReducers.unshift(contextFieldName);
  }

  const reducer = pipe(...composableReducers);
  return createReducer(trackingState => {
    if (!trackingState.context[field as any]) {
      reducer(trackingState);
    }
  });
};

export const predicate = <State, Action>(
  contextFieldName:
    | string
    | StaticOrValueResolverWithContext<State, Action, boolean>,
  predicateResolver:
    | StaticOrValueResolverWithContext<State, Action, boolean>
    | ComposableReducer<State, Action>,
  ...composableReducers: ComposableReducer<State, Action>[]
) => {
  let field: string | typeof CONTEXT_PREDICATE_FIELD = CONTEXT_PREDICATE_FIELD;
  let p: StaticOrValueResolverWithContext<State, Action, boolean>;

  if (isString(contextFieldName)) {
    field = contextFieldName;
    // @ts-ignore
    p = predicateResolver;
  } else {
    p = contextFieldName;
    // @ts-ignore
    composableReducers.unshift(predicateResolver);
  }

  const resolvePredicate = wrapValueResolver(p);

  return withContextBase(
    trackingState => ({
      [field]: resolvePredicate(trackingState)
    }),
    composableReducers
  );
};
