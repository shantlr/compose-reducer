import { StaticOrValueResolverWithContext } from '../../helpers/resolve';
import { branch } from '../flow/branch';
import { setValue } from './setValue';

// interface ReduxAction {
//   type: string | number;
// }

// export type ReduxActionCreatorMap<T> = {
//   [k in keyof T]: T[K];
// };
export type ActionUnion<T, K extends keyof T = keyof T> = T[K] extends (
  ...args: any[]
) => infer U
  ? U
  : never;

// export const actionHint = <
//   State,
//   T extends Record<string | number, (...args: any[]) => ReduxAction>
// >(
//   actionCreatorMap: T
// ): ComposableReducer<State, ActionUnion<typeof actionCreatorMap>> => {
//   return createReducer(() => {
//     // No op
//   });
// };
export type InferAction<Action, ActionCreatorMap> = Action extends unknown
  ? ActionCreatorMap extends Record<any, any>
    ? ActionUnion<ActionCreatorMap>
    : Action
  : Action;

export const initState = <State, Action, T = any>(
  valueResolver: StaticOrValueResolverWithContext<
    State,
    InferAction<Action, T>,
    State
  >,
  actionCreatorMap?: T
) => {
  return branch<State, InferAction<Action, T>>(
    state => state === undefined,
    setValue('', valueResolver)
  );
};
