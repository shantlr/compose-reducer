import { get, PathElem } from '../../utils/get';
import { isRootPath } from '../../utils/isRootPath';
import { shallowClone } from '../../utils/shallowClone';
import { initial } from '../../utils/initial';
import { last } from '../../utils/last';
import { has } from '../../utils/has';

export class StateManager<State> {
  initialState: State;
  nextState: State;

  _isNewReference: {
    [key: string]: boolean;
  };

  constructor(initialState: State) {
    this.initialState = initialState;
    this.nextState = initialState;

    this._isNewReference = {};
  }

  getRefKey(path: PathElem[]): string {
    return (path || []).join('.');
  }

  ensureNewRefInNextState(path: PathElem[] = []) {
    const refKey = this.getRefKey(path);

    // if is already a new ref => return as is
    if (this._isNewReference[refKey]) {
      return get(this.nextState, path);
    }

    this._isNewReference[refKey] = true;

    // state root case
    if (isRootPath(path)) {
      // new ref of state
      this.nextState = shallowClone(this.nextState);
      return this.nextState;
    }

    // sub field case
    const parentPath = initial(path);
    const parentState = this.ensureNewRefInNextState(parentPath);
    const key = last(path);

    // and create a new ref of field
    // in case field was an array => copy as array else as object
    parentState[key] = shallowClone(parentState[key]);

    return parentState[key];
  }

  updateState(path: PathElem[], value: any) {
    // ensure that all parent container are new ref
    const parentPath = initial(path);
    const parentState = this.ensureNewRefInNextState(parentPath);

    if (isRootPath(path)) {
      // nil path => update root
      this.nextState = value;
    } else {
      // as parent state container is a new ref, we can mutate
      const key = last(path);
      parentState[key] = value;
    }

    return value;
  }

  unsetState(path: PathElem[]) {
    const parentPath = initial(path);

    if (!has(this.nextState, path)) {
      return;
    }

    // ensure that all parent container are new ref
    const parentState = this.ensureNewRefInNextState(parentPath);

    if (isRootPath(path)) {
      this.nextState = undefined;
    } else {
      // as parent state container is a new ref, we can mutate
      const key = last(path);
      delete parentState[key];
    }
  }
}
