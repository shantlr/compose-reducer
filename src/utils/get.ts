import { isNil } from './isNil';

export type PathElem = string | number;

// resolve type of get(T, P)
export type ValueAtPathImpl<T, P extends PathElem[]> =
  P extends [] ? T : T extends Record<
    PathElem,
    any
  >
    ? P extends [infer U, ...(infer R)]
      ? U extends keyof T
        ? R extends PathElem[]
          ? ValueAtPathImpl<T[U], R>
          : T[U]
        : '__invalid_path' | unknown
      : '__invalid_path' | unknown
    : '__value_not_record' | unknown;

export type ValueAtPath<T, P> = P extends PathElem[]
  ? ValueAtPathImpl<T, P>
  : P extends string
  ? ValueAtPathImpl<T, DottedStringToPath<P>>
  // : P extends PathElem
  // ? ValueAtPathImpl<T, [P]>
  : P extends (...args: any[]) => infer Res
  ? ValueAtPath<T, Res>
  : any;


// type A = ValueAtPath<{ world: 'test' }, 'world'>

export type DottedStringToPath<T> = T extends `${infer U}.${infer V}`
  ? [U, ...DottedStringToPath<V>]
  : T extends `${infer U}` ? [U] : never;

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

// type P = ResolvableDottedStringPath<{
//   test: 'hello',
//   world: {
//     field: {
//       test: '1'
//     }
//   }
// }>

// type Test = ValueAtPath<{
//   world: {
//     test: 1
//   }
// }, "world.test">

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
