import { withContextBase } from './withContext';
import { createReducer } from '../../helpers/createReducer';
import { get } from '../../utils/get';

const PROVIDE_RESOLVER_CONTEXT = Symbol('Resolver context');

export const provideResolver = (resolverMap, ...composableReducers) =>
  withContextBase(
    trackingState => ({
      [PROVIDE_RESOLVER_CONTEXT]: {
        ...(trackingState.context[PROVIDE_RESOLVER_CONTEXT] || null),
        ...resolverMap
      }
    }),
    composableReducers
  );

export const injectResolver = resolverKey => {
  return createReducer(trackingState => {
    const resolver = get(trackingState.context, [
      PROVIDE_RESOLVER_CONTEXT,
      resolverKey
    ]);

    if (resolver) {
      resolver(trackingState);
    } else {
      throw new Error(`Cannot inject unprovided resolver '${resolverKey}'`);
    }
  });
};
