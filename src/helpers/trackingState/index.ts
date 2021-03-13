import { PathElem } from '../../utils/get';
import { StateManager } from './stateManager';

export const ACTION_OVERRIDE_SYMBOL = Symbol('Action override symbol');
export const PATH_OVERRIDE_SYMBOL = Symbol('Action override symbol');

export type Context<Action> = Record<any, unknown> & {
  [PATH_OVERRIDE_SYMBOL]?: string[];
  [ACTION_OVERRIDE_SYMBOL]?: Action;
};

export class TrackingState<State, Action> {
  _stateManager: StateManager<State>;

  initialAction: Action;
  context: Context<Action>;

  constructor(initialState: State, action: Action) {
    this._stateManager = new StateManager(initialState);

    this.initialAction = action;

    this.context = {};
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

  updateState(path: PathElem[], value: any) {
    return this._stateManager.updateState(path, value);
  }

  unsetState(path: PathElem[]) {
    return this._stateManager.unsetState(path);
  }

  getPath(): PathElem[] {
    return this.context[PATH_OVERRIDE_SYMBOL] || [];
  }
}
