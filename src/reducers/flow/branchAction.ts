import { ComposableReducer, createReducer } from '../../helpers/createReducer';
import { initial } from '../../utils/initial';
import { last } from '../../utils/last';
import { isFunction } from '../../utils/isFunction';
import { resolveValueWithContext } from '../../helpers/resolve';
import { TrackingState } from '../../helpers/trackingState';

export interface ReduxAction {
  type: string | number;
}

type ActionReducerMap<State, Action extends ReduxAction> = {
  [key in Action['type']]?: ComposableReducer<
    State,
    Action & {
      type: key;
    }
  >[];
};

const addReducer = <State, Action extends ReduxAction>(
  actionMap: ActionReducerMap<State, Action>,
  type: Action['type'],
  reducer: ComposableReducer<State, Action> | ComposableReducer<State, Action>[]
): void => {
  if (!actionMap[type]) {
    actionMap[type] = [];
  }

  if (isFunction(reducer)) {
    actionMap[type].push(reducer);
  } else if (Array.isArray(reducer)) {
    actionMap[type].push(...reducer);
  }
};

const predicateHandler = <State, Action>(
  predicate: (trackingState: TrackingState<State, Action>) => boolean,
  reducer: ComposableReducer<State, Action>
): ComposableReducer<State, Action> => {
  return trackingState => {
    if (predicate(trackingState)) {
      return reducer(trackingState);
    }
    return trackingState;
  };
};

const actionMapToPredicate = <State, Action extends ReduxAction>(
  actionMap: {
    [key in Action['type']]?: boolean;
  }
) => {
  return (trackingState: TrackingState<State, Action>) =>
    Boolean(actionMap[trackingState.action.type]);
};

const actionMapToHandler = <State, Action extends ReduxAction>(
  actionMap: ActionReducerMap<State, Action>
): ComposableReducer<State, Action> => {
  return trackingState => {
    const reducers: ComposableReducer<State, Action>[] =
      actionMap[trackingState.action.type];
    if (reducers) {
      reducers.forEach(reducer => reducer(trackingState));
    }
    return trackingState;
  };
};

const addCurrentMapStep = <State, Action extends ReduxAction>(acc: {
  currentMap: ActionReducerMap<State, Action>;
  steps: ComposableReducer<State, Action>[];
}) => {
  if (Object.keys(acc.currentMap).length) {
    acc.steps.push(actionMapToHandler(acc.currentMap));
    // reset current map
    acc.currentMap = {};
  }
  return acc;
};

const typesToPredicate = <State, Action extends ReduxAction>(
  types: Action['type'][]
): ((trackingState: TrackingState<State, Action>) => boolean) => {
  const actionTypeMap: {
    [key in Action['type']]?: boolean;
  } = {};
  const predicates = [];
  types.forEach(type => {
    if (typeof type === 'string') {
      actionTypeMap[type] = true;
    } else {
      predicates.push(type);
    }
  });

  const typeMapPredicate = actionMapToPredicate(actionTypeMap);

  return trackingState =>
    typeMapPredicate(trackingState) ||
    predicates.some(predicate =>
      resolveValueWithContext(predicate, trackingState)
    );
};

/**
 * Batch branches as much as possible into step
 * Turn multiple array into map if possible
 * e.g: [{ INCREASE: reducer1 }, ['INCREASE', reducer2], ['DECREASE', reducer3]] create a single step
 * => [{ INCREASE: [reducer1, reducer2], DECREASE: [reducer3] }]
 * @param {Array} branches
 */
const compileBranches = <State, Action extends ReduxAction>(
  branches: (BranchActionMap<State, Action> | BranchActionCase<State, Action>)[]
): ComposableReducer<State, Action>[] => {
  const res: {
    steps: ComposableReducer<State, Action>[];
    currentMap: ActionReducerMap<State, Action>;
  } = branches.reduce(
    (acc, branch) => {
      if (Array.isArray(branch)) {
        const types = initial(branch) as Action['type'][];
        const reducer = last(branch) as ComposableReducer<
          State,
          Action & {
            type: typeof types;
          }
        >;

        const doContainPredicate = Boolean(types.find(t => isFunction(t)));

        if (doContainPredicate) {
          // if array branch contain a predicate => this array will be a separate step
          addCurrentMapStep(acc);
          acc.steps.push(predicateHandler(typesToPredicate(types), reducer));
        } else {
          types.forEach(type => addReducer(acc.currentMap, type, reducer));
        }
      } else if (typeof branch === 'object') {
        Object.keys(branch).forEach(type => {
          addReducer(acc.currentMap, type, branch[type]);
        });
      }

      return acc;
    },
    {
      steps: [],
      currentMap: {}
    }
  );

  return addCurrentMapStep(res).steps;
};

export type BranchActionMap<State, Action extends ReduxAction> = {
  [key in Action['type']]: ComposableReducer<
    State,
    Action & {
      type: key;
    }
  >;
};
export type BranchActionCase<State, Action extends ReduxAction> = [
  ...Action['type'][],
  ComposableReducer<
    State,
    Action & {
      type: Action['type'];
    }
  >
];

export const branchAction = <State, Action extends ReduxAction>(
  ...branches: (
    | BranchActionMap<State, Action>
    | BranchActionCase<State, Action>
  )[]
): ComposableReducer<State, Action> => {
  const steps: ComposableReducer<State, Action>[] = compileBranches(branches);

  return createReducer(trackingState => {
    if (trackingState.action) {
      steps.forEach(reducer => reducer(trackingState));
    }
  });
};
