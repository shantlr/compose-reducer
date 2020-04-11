import { TrackingState } from '../../../src/helpers/trackingState';
import { withContext, createReducer } from '../../../src';

describe('reducers', () => {
  describe('context', () => {
    describe('withContext', () => {
      let trackingState;
      beforeEach(() => {
        trackingState = new TrackingState();
      });

      it('should add given static context', () => {
        let context;
        const composableReducer = jest.fn().mockImplementation(ts => {
          context = ts.context;
        });
        withContext({ hello: 'world' }, composableReducer)(trackingState);
        expect(composableReducer).toBeCalled();
        expect(trackingState.context).not.toBe(context);
        expect(context).toMatchObject({
          hello: 'world'
        });
      });

      it('should scope added context', () => {
        const composableReducer = jest.fn();
        withContext({ hello: 'world' }, composableReducer)(trackingState);
        expect(trackingState.context).toEqual({});
      });

      it('should be composable', () => {
        let c1;
        const r1 = jest.fn().mockImplementation(
          createReducer(ts => {
            c1 = ts.context;
          })
        );

        let c2;
        const r2 = jest.fn().mockImplementation(
          createReducer(ts => {
            c2 = ts.context;
          })
        );

        withContext(
          { hello: 'world' },
          r1,
          withContext({ world: 'hello' }, r2)
        )(trackingState);

        expect(r1).toBeCalled();
        expect(r2).toBeCalled();

        expect(trackingState.context).not.toBe(c1);
        expect(trackingState.context).not.toBe(c2);
        expect(c1).not.toBe(c2);
        expect(c1).toEqual({
          hello: 'world'
        });

        expect(c2).toEqual({
          hello: 'world',
          world: 'hello'
        });

        expect(trackingState.context).toEqual({});
      });

      describe('when no context is resolved', () => {
        it('should not call reducers', () => {
          const composableReducer = jest.fn();
          withContext(null, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          withContext(undefined, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          withContext(() => null, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          withContext(() => undefined, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();
        });
      });
    });
  });
});
