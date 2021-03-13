import { initial } from '../utils/initial';
import { last } from '../utils/last';

type Compute<
  R extends ((...args: any[]) => any)[],
  AccArgs extends any[] = undefined,
  Last = undefined
> = R extends []
  ? (...args: AccArgs) => Last
  : R extends [infer U, ...(infer O)]
  ? U extends (...args: any[]) => any
    ? O extends ((...args: any[]) => any)[]
      ? Compute<
          O,
          AccArgs extends undefined ? [] : [...AccArgs, Last],
          ReturnType<U>
        >
      : (...args: any[]) => any
    : (...args: any[]) => any
  : (...args: any[]) => any;

export function compute(): () => undefined;
export function compute<F extends (...args: any[]) => any>(f: F): F;
export function compute<Args extends any[], R1, R>(
  f1: (...args: Args) => R1,
  r: (arg: R1) => R
): (...args: Args) => R;
export function compute<Args extends any[], R1, R2, R>(
  f1: (...args: Args) => R1,
  f2: (...args: Args) => R2,
  r: (a1: R1, a2: R2) => R
): (...args: Args) => R;
export function compute<Args extends any[], R1, R2, R3, R>(
  f1: (...args: Args) => R1,
  f2: (...args: Args) => R2,
  f3: (...args: Args) => R3,
  r: (a1: R1, a2: R2, a3: R3) => R
): (...args: Args) => R;
export function compute<Args extends any[], R1, R2, R3, R4, R>(
  f1: (...args: Args) => R1,
  f2: (...args: Args) => R2,
  f3: (...args: Args) => R3,
  f4: (...args: Args) => R4,
  r: (a1: R1, a2: R2, a3: R3, a4: R4) => R
): (...args: Args) => R;
export function compute<Args extends any[], R1, R2, R3, R4, R5, R>(
  f1: (...args: Args) => R1,
  f2: (...args: Args) => R2,
  f3: (...args: Args) => R3,
  f4: (...args: Args) => R4,
  f5: (...args: Args) => R5,
  r: (a1: R1, a2: R2, a3: R3, a4: R4, a5: R5) => R
): (...args: Args) => R;
export function compute<Args extends any[], R1, R2, R3, R4, R5, R6, R>(
  f1: (...args: Args) => R1,
  f2: (...args: Args) => R2,
  f3: (...args: Args) => R3,
  f4: (...args: Args) => R4,
  f5: (...args: Args) => R5,
  f6: (...args: Args) => R6,
  r: (a1: R1, a2: R2, a3: R3, a4: R4, a5: R5, a6: R6) => R
): (...args: Args) => R;

export function compute(
  ...resolvers: ((...args: any[]) => any)[]
): Compute<typeof resolvers> {
  if (!resolvers.length) {
    return () => undefined;
  }

  const argResolvers = initial(resolvers);
  const valueResolver = last(resolvers);
  return (...args) => {
    const resolvedArgs = argResolvers.map(r => r(...args));
    return valueResolver(...resolvedArgs);
  };
}
