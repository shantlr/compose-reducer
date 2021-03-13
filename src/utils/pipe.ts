export function pipe(): () => undefined;
export function pipe<A extends any[], R1>(
  f1: (...args: A) => R1
): (...args: A) => R1;
export function pipe<A extends any[], R1, R2>(
  f1: (...args: A) => R1,
  f2: (arg: R1) => R2
): (...args: A) => R2;
export function pipe<A extends any[], R1, R2, R3>(
  f1: (...args: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R1) => R3
): (...args: A) => R3;
export function pipe<A extends any[], R1, R2, R3, R4>(
  f1: (...args: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4
): (...args: A) => R4;
export function pipe<A extends any[]>(
  ...f: ((...args: any[]) => any)[]
): (...args: A) => any;

export function pipe<A extends any[]>(
  firstFunction?: (...args: A) => any,
  ...functions: ((args: any[]) => any)[]
): (...args: A) => any {
  if (!firstFunction) {
    return () => undefined;
  }

  if (!functions.length) {
    return firstFunction;
  }

  return (...args: A) =>
    functions.reduce((value, ft) => ft(value), firstFunction(...args));
}
