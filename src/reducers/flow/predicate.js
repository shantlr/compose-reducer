import { resolve } from '../../helpers/resolve';
import { withContextBase } from '../context/withContext';
import { isString } from '../../utils/isString';
import { pipe } from '../../utils/pipe';
import { createReducer } from '../../helpers/createReducer';

const CONTEXT_PREDICATE_FIELD = Symbol('PREDICATE_VALUE');

export const predicate = (
  contextFieldName,
  predicateResolver,
  ...composableReducers
) => {
  let field = CONTEXT_PREDICATE_FIELD;
  let p;

  if (isString(contextFieldName)) {
    field = contextFieldName;
    p = predicateResolver;
  } else {
    p = contextFieldName;
    composableReducers.unshift(predicateResolver);
  }

  return withContextBase(
    trackingState => ({
      [field]: resolve(p, trackingState)
    }),
    composableReducers
  );
};

export const ifTrue = (contextFieldName, ...composableReducers) => {
  let field = CONTEXT_PREDICATE_FIELD;

  if (isString(contextFieldName)) {
    field = contextFieldName;
  } else {
    composableReducers.unshift(contextFieldName);
  }

  const reducer = pipe(...composableReducers);
  return createReducer(trackingState => {
    if (trackingState.context[field]) {
      reducer(trackingState);
    }
  });
};

export const ifFalse = (contextFieldName, ...composableReducers) => {
  let field = CONTEXT_PREDICATE_FIELD;

  if (isString(contextFieldName)) {
    field = contextFieldName;
  } else {
    composableReducers.unshift(contextFieldName);
  }

  const reducer = pipe(...composableReducers);
  return createReducer(trackingState => {
    if (!trackingState.context[field]) {
      reducer(trackingState);
    }
  });
};
