import { StaticOrValueResolverWithContext } from '../../helpers/resolve';
import { branch } from '../flow/branch';
import { setValue } from './setValue';

export type ActionUnion<T, K extends keyof T = keyof T> = T[K] extends (
  ...args: any[]
) => infer U
  ? U
  : never;

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
