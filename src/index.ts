export { composeReducer, createReducer } from './helpers/createReducer';

export { initState } from './reducers/value/initState';

export { setValue, setValueBase } from './reducers/value/setValue';
export { unsetValue } from './reducers/value/unsetValue';

export { incValue } from './reducers/value/incValue';
export { decValue } from './reducers/value/decValue';

export { popValues } from './reducers/value/popValues';
export { pushValue, pushValues } from './reducers/value/pushValues';

export { branch } from './reducers/flow/branch';
export { branchAction } from './reducers/flow/branchAction';

export { withContext } from './reducers/context/withContext';
export { at } from './reducers/context/at';
export { mapAction, mapActions, onEach } from './reducers/flow/mapAction';
export {
  provideResolver,
  injectResolver
} from './reducers/context/provideResolver';

export { pipe, pipe as composable } from './utils/pipe';

export {
  fromAction,
  fromAction as getAction
} from './valueResolver/fromAction';
export { fromState, fromState as getState } from './valueResolver/fromState';
export { compute } from './valueResolver/compute';
export { object } from './valueResolver/object';
export { array } from './valueResolver/array';

export { max } from './valueResolver/max';
export { min } from './valueResolver/min';
export { gt } from './valueResolver/gt';
export { gte } from './valueResolver/gte';
export { lt } from './valueResolver/lt';
export { lte } from './valueResolver/lte';
export { eq } from './valueResolver/eq';
