import { withContextBase } from './withContext';
import { ComposableReducer, createReducer } from '../../helpers/createReducer';
import { get } from '../../utils/get';
import { isFunction } from '../../utils/isFunction';

const PROVIDE_RESOLVER_CONTEXT = Symbol('Resolver context');

export const provideResolver = <State, Action>(
  resolverMap: {
    [key: string]: ComposableReducer<State, Action>;
  },
  ...composableReducers: ComposableReducer<State, Action>[]
) =>
  withContextBase(
    trackingState => ({
      [PROVIDE_RESOLVER_CONTEXT]: {
        // @ts-ignore
        ...(trackingState.context[PROVIDE_RESOLVER_CONTEXT] || null),
        ...resolverMap
      }
    }),
    composableReducers
  );

export const injectResolver = <State, Action>(
  resolverKey: string
): ComposableReducer<State, Action> => {
  return createReducer(trackingState => {
    const resolver = get(trackingState.context, [
      PROVIDE_RESOLVER_CONTEXT as any,
      resolverKey
    ]);

    if (resolver && isFunction(resolver)) {
      resolver(trackingState);
    } else {
      throw new Error(`Cannot inject unprovided resolver '${resolverKey}'`);
    }
  });
};
