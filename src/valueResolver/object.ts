import { StaticOrValueResolver, ValueResolver } from '../helpers/resolve';
import { isFunction } from '../utils/isFunction';

type ObjectReducer<State, Action, T> = (
  result: Partial<T>,
  state: State,
  action: Action
) => void;

type ObjectReducerMap<State, Action> = {
  [key: string]: StaticOrValueResolver<State, Action, any>;
};

type ResultObject<State, Action, T extends ObjectReducerMap<State, Action>> = {
  [Key in keyof T]: T[Key] extends ValueResolver<State, Action, infer U>
    ? U
    : T[Key];
};

export const object = <
  State,
  Action,
  T extends ObjectReducerMap<State, Action>
>(
  objFieldResolvers: T
): ValueResolver<
  State,
  Action,
  {
    [Key in keyof T]: T[Key] extends ValueResolver<State, Action, infer U>
      ? U
      : T[Key];
  }
> => {
  const base: Partial<ResultObject<State, Action, T>> = {};
  const resolvers: ObjectReducer<
    State,
    Action,
    ResultObject<State, Action, T>
  >[] = [];

  const keys: (keyof T)[] = Object.keys(objFieldResolvers);
  keys.forEach(key => {
    const fieldValue = objFieldResolvers[key];
    if (isFunction(fieldValue)) {
      resolvers.push((result, state, action) => {
        result[key] = fieldValue(state, action);
      });
    } else {
      base[key] = fieldValue;
    }
  });

  if (!resolvers.length) {
    const staticObjectResolver = () => base;
    return staticObjectResolver as ValueResolver<
      State,
      Action,
      ResultObject<State, Action, T>
    >;
  }

  const objectResolver: ValueResolver<
    State,
    Action,
    ResultObject<State, Action, T>
  > = (state, action) => {
    const result = { ...base };
    resolvers.forEach(r => {
      r(result, state, action);
    });
    return result as ResultObject<State, Action, T>;
  };

  return objectResolver;
};
