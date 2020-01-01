import { composeReducer, setValue, withContext } from '../../../src';
import {
  predicate,
  ifTrue,
  ifFalse
} from '../../../src/reducers/flow/predicate';
import { TrackingState } from '../../../src/helpers/trackingState';

describe('reducers', () => {
  describe('flow', () => {
    describe('predicate', () => {
      it('should call resolver if no custom context field provided', () => {
        const f = jest.fn();
        const reducer = composeReducer(predicate(() => true, f));
        reducer();

        expect(f).toHaveBeenCalled();
        expect(f.mock.calls[0][0]).toBeInstanceOf(TrackingState);
      });

      it('should add custom context field', () => {
        let context;
        const f = jest.fn(ts => {
          context = ts.context;
        });

        const predicateResolver = jest.fn(() => true);

        const reducer = composeReducer(
          predicate('field', predicateResolver, f)
        );
        reducer();
        expect(predicateResolver).toHaveBeenCalled();
        expect(f).toHaveBeenCalled();
        expect(context).toMatchObject({
          field: true
        });
      });
    });

    describe('ifTrue', () => {
      it('should call predicate with state and action', () => {
        const f = jest.fn(() => true);
        const reducer = composeReducer(predicate(f));

        const initialState = {};
        const action = {};
        reducer(initialState, action);
        expect(f).toHaveBeenCalled();
        expect(f.mock.calls[0][0]).toBe(initialState);
        expect(f.mock.calls[0][1]).toBe(action);
      });
      it('should call resolver if predicate resolve true', () => {
        const reducer = composeReducer(
          predicate(() => true, ifTrue(setValue('', 'it works')))
        );
        expect(reducer()).toBe('it works');
      });

      it('should not call resolver if predicate resolve false', () => {
        const f = jest.fn();
        const reducer = composeReducer(predicate(() => false, ifTrue(f)));
        reducer();
        expect(f).not.toHaveBeenCalled();
      });

      describe('with custom context field', () => {
        it('should call resolver if context field is true', () => {
          const reducer = composeReducer(
            withContext(
              () => ({ field: true }),
              ifTrue('field', setValue(null, 'it works'))
            )
          );
          expect(reducer()).toBe('it works');
        });

        it('should not call resolver if context field is false', () => {
          const reducer = composeReducer(
            withContext(
              () => ({ field: false }),
              ifTrue('field', setValue(null, 'it works'))
            )
          );
          expect(reducer()).toBe(undefined);
        });
      });
    });

    describe('ifFalse', () => {
      it('should call predicate with state and action', () => {
        const f = jest.fn(() => true);
        const reducer = composeReducer(predicate(f));

        const initialState = {};
        const action = {};
        reducer(initialState, action);
        expect(f).toHaveBeenCalled();
        expect(f.mock.calls[0][0]).toBe(initialState);
        expect(f.mock.calls[0][1]).toBe(action);
      });
      it('should call resolver if predicate resolve false', () => {
        const reducer = composeReducer(
          predicate(() => false, ifFalse(setValue('', 'it works')))
        );
        expect(reducer()).toBe('it works');
      });

      it('should not call resolver if predicate resolve true', () => {
        const f = jest.fn();
        const reducer = composeReducer(predicate(() => true, ifFalse(f)));
        reducer();
        expect(f).not.toHaveBeenCalled();
      });

      describe('with custom context field', () => {
        it('should call resolver if context field is false', () => {
          const reducer = composeReducer(
            withContext(
              () => ({ field: false }),
              ifFalse('field', setValue(null, 'it works'))
            )
          );
          expect(reducer()).toBe('it works');
        });

        it('should not call resolver if context field is true', () => {
          const reducer = composeReducer(
            withContext(
              () => ({ field: true }),
              ifFalse('field', setValue(null, 'it works'))
            )
          );
          expect(reducer()).toBe(undefined);
        });
      });
    });
  });
});
