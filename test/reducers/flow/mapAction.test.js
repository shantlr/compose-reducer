import { TrackingState } from '../../../src/helpers/trackingState';
import { mapAction, createReducer } from '../../../src';

describe('reducers', () => {
  describe('context', () => {
    describe('mapAction', () => {
      let trackingState;
      beforeEach(() => {
        trackingState = new TrackingState();
      });

      it('should replace with given static action', () => {
        let action;
        const composableReducer = jest.fn().mockImplementation(ts => {
          action = ts.action;
        });
        const expectedAction = {};
        mapAction(expectedAction, composableReducer)(trackingState);
        expect(composableReducer).toBeCalled();
        expect(trackingState.action).not.toBe(action);
        expect(action).toBe(expectedAction);
      });

      it('should only replace action in inner scope', () => {
        const composableReducer = jest.fn();
        mapAction({ hello: 'world' }, composableReducer)(trackingState);
        // should not replace action outside of scope
        expect(trackingState.action).toEqual(undefined);
      });

      it('should be composable', () => {
        let a1;
        const r1 = jest.fn().mockImplementation(
          createReducer(ts => {
            a1 = ts.action;
          })
        );

        let a2;
        const r2 = jest.fn().mockImplementation(
          createReducer(ts => {
            a2 = ts.action;
          })
        );

        const expectedAction1 = { hello: 'world' };
        const expectedAction2 = { world: 'hello' };
        mapAction(
          expectedAction1,
          r1,
          mapAction(expectedAction2, r2)
        )(trackingState);

        expect(r1).toBeCalled();
        expect(r2).toBeCalled();

        expect(trackingState.action).not.toBe(a1);
        expect(trackingState.action).not.toBe(a2);
        expect(a1).not.toBe(a2);
        expect(a1).toBe(expectedAction1);

        expect(a2).toBe(expectedAction2);

        expect(trackingState.context).toEqual({});
      });

      it('should replace action with resolved null', () => {
        let action;
        const r = jest.fn().mockImplementation(
          createReducer(ts => {
            action = ts.action;
          })
        );
        mapAction(() => null, r)(trackingState);
        expect(action).toBe(null);
      });
    });
  });
});
