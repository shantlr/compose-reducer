import { isNil } from './isNil';

export type PathElem = string | number;

// resolve type of get(T, P)
export type ValueAtPathImpl<T, P extends PathElem[]> = T extends Record<
  PathElem,
  any
>
  ? P extends [infer U, ...(infer R)]
    ? U extends keyof T
      ? R extends PathElem[]
        ? ValueAtPathImpl<T[U], R>
        : U
      : U
    : T
  : T;

export type ValueAtPath<T, P> = P extends PathElem[]
  ? ValueAtPathImpl<T, P>
  : P extends PathElem
  ? ValueAtPathImpl<T, [P]>
  : P extends (...args: any[]) => infer Res
  ? ValueAtPath<T, Res>
  : never;

// resolve possible path of object
export type ResolvableDottedStringPathImpl<
  State extends Record<string, any>,
  K extends keyof State = keyof State
> =
  K extends (string | number) ?
      K | (State[K] extends Record<string | number, any>
      ? `${K}.${ResolvableDottedStringPathImpl<State[K]>}`
      : never)
    : never;

export type ResolvableDottedStringPath<State> = State extends Record<string | number, any>
  ? ResolvableDottedStringPathImpl<State>
  : never;

export type PathUnionToTuple<T extends PathElem, U> = U extends never
  ? [T]
  : U extends PathElem[]
  ? [T, ...U]
  : [T];

export type ResolvableArrayPathImpl<
  T,
  K extends keyof T = keyof T
> = T extends Record<PathElem, any>
  ?
      | [K]
      | (K extends PathElem
          ? PathUnionToTuple<K, ResolvableArrayPathImpl<T[K]>>
          : never)
  : never;
export type ResolvableArrayPath<T> =
  | []
  | (T extends Record<PathElem, any> ? ResolvableArrayPathImpl<T> : never);

export function get<T, P extends PathElem[]>(
  value: T,
  path: P
): ValueAtPath<T, P> {
  let selectedValue: any = value;

  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i += 1) {
      if (isNil(selectedValue)) {
        break;
      }
      const field = path[i];
      if (field !== '') {
        selectedValue = selectedValue[field];
      }
    }
  }

  return selectedValue;
}
