import { StateManager } from './stateManager';

export const ACTION_OVERRIDE_SYMBOL = Symbol('Action override symbol');
export const PATH_OVERRIDE_SYMBOL = Symbol('Action override symbol');

export class TrackingState {
  constructor(initialState, action) {
    this._stateManager = new StateManager(initialState);

    this.initialAction = action;

    this.context = {};
    this.isNewReference = {};
  }

  get initialState() {
    return this._stateManager.initialState;
  }

  get nextState() {
    return this._stateManager.nextState;
  }

  get action() {
    const overrideAction = this.context[ACTION_OVERRIDE_SYMBOL];
    if (overrideAction !== undefined) {
      return overrideAction;
    }
    return this.initialAction;
  }

  updateState(path, value) {
    return this._stateManager.updateState(path, value);
  }

  unsetState(path) {
    return this._stateManager.unsetState(path);
  }

  getPath() {
    return this.context[PATH_OVERRIDE_SYMBOL] || [];
  }
}
