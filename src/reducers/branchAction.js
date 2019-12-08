import { createReducer } from '../helpers/createReducer';
import { initial } from '../utils/initial';
import { last } from '../utils/last';
import { resolve } from '../helpers/resolve';

const addReducer = (actionMap, type, reducer) => {
  if (!actionMap[type]) {
    actionMap[type] = [reducer];
  } else {
    actionMap[type].push(reducer);
  }
};

const actionMapToHandler = actionMap => {
  return createReducer(trackingState => {
    const reducers = actionMap[trackingState.action.type];
    if (reducers) {
      reducers.forEach(reducer => reducer(trackingState));
    }
  });
};
const predicateHandler = (predicate, reducer) => {
  return createReducer(trackingState => {
    if (resolve(predicate, trackingState)) {
      reducer(trackingState);
    }
  });
};

const addCurrentMapStep = acc => {
  if (Object.keys(acc.currentMap).length) {
    acc.steps.push(actionMapToHandler(acc.currentMap));
  }
  return acc;
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

        types.forEach(type => {
          if (typeof type === 'string') {
            addReducer(acc.currentMap, type, reducer);
          } else {
            // if type is a predicate => we push current map as a step
            const isHandledPredicate = type;
            addCurrentMapStep(acc);

            // then add given predicate and reducer as another step
            // => This is to ensure that reducers are called in right order
            acc.steps.push(predicateHandler(isHandledPredicate, reducer));
          }
        });
      } else if (typeof branch === 'object') {
        Object.keys(branch).forEach((reducer, type) => {
          addReducer(acc.currentMap, type, reducer);
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
