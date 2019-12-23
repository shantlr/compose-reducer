import { createReducer } from '../helpers/createReducer';
import { initial } from '../utils/initial';
import { last } from '../utils/last';
import { resolve } from '../helpers/resolve';
import { isFunction } from '../utils/isFunction';

const addReducer = (actionMap, type, reducer) => {
  if (!actionMap[type]) {
    actionMap[type] = [reducer];
  } else {
    actionMap[type].push(reducer);
  }
};

const predicateHandler = (predicate, reducer) => {
  return createReducer(trackingState => {
    if (resolve(predicate, trackingState)) {
      reducer(trackingState);
    }
  });
};

const actionMapToPredicate = actionMap => {
  return createReducer(trackingState =>
    Boolean(actionMap[[trackingState.action.type]])
  );
};

const actionMapToHandler = actionMap => {
  return createReducer(trackingState => {
    const reducers = actionMap[trackingState.action.type];
    if (reducers) {
      reducers.forEach(reducer => reducer(trackingState));
    }
  });
};

const addCurrentMapStep = acc => {
  if (Object.keys(acc.currentMap).length) {
    acc.steps.push(actionMapToHandler(acc.currentMap));
    // reset current map
    acc.currentMap = {};
  }
  return acc;
};

const typesToPredicate = types => {
  const actionTypeMap = {};
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
    typeMapPredicate(trackingState) || predicates.some(p => p(trackingState));
};

/**
 * Batch branches as much as possible into step
 * Turn multiple array into map if possible
 * e.g: [{ INCREASE: reducer1 }, ['INCREASE', reducer2], ['DECREASE', reducer3]] create a single step
 * => [{ INCREASE: [reducer1, reducer2], DECREASE: [reducer3] }]
 * @param {Array} branches
 */
const compileBranches = branches => {
  const res = branches.reduce(
    (acc, branch) => {
      if (Array.isArray(branch)) {
        const types = initial(branch);
        const reducer = last(branch);

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

export const branchAction = (...branches) => {
  const steps = compileBranches(branches);

  return createReducer(trackingState => {
    if (trackingState.action) {
      steps.forEach(reducer => reducer(trackingState));
    }
  });
};
