import { at, createReducer } from '../../../src';
import { TrackingState } from '../../../src/helpers/trackingState';

describe('reducers', () => {
  describe('context', () => {
    describe('at', () => {
      let trackingState;
      beforeEach(() => {
        trackingState = new TrackingState();
      });

      describe('when path is nil', () => {
        it('should not call reducers', () => {
          const composableReducer = jest.fn();
          at(null, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          at(undefined, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          at(() => null, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();

          at(() => undefined, composableReducer)(trackingState);
          expect(composableReducer).not.toHaveBeenCalled();
        });
      });

      describe('when path is string', () => {
        it('should not path when given path is root', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at('', composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual([]);
        });

        it('should update path', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at('field', composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual(['field']);
        });

        it('should update nested path', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at('field.subField', composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual(['field', 'subField']);
        });
      });

      describe('when path is array', () => {
        it('should not path when given path is root', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at([], composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual([]);
        });

        it('should update path', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at(['field'], composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual(['field']);
        });

        it('should update nested path', () => {
          let path;
          const composableReducer = jest.fn().mockImplementation(ts => {
            path = ts.getPath();
          });
          at(['field', 'subField'], composableReducer)(trackingState);
          expect(composableReducer).toBeCalled();
          expect(path).toEqual(['field', 'subField']);
        });
      });

      describe('when path is function', () => {
        describe('when resolved path is string', () => {
          it('should not path when given path is root', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => '', composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual([]);
          });

          it('should update path', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => 'field', composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual(['field']);
          });

          it('should update nested path', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => 'field.subField', composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual(['field', 'subField']);
          });
        });

        describe('when resolved path is array', () => {
          it('should not path when given path is root', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => [], composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual([]);
          });

          it('should update path', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => ['field'], composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual(['field']);
          });

          it('should update nested path', () => {
            let path;
            const composableReducer = jest.fn().mockImplementation(ts => {
              path = ts.getPath();
            });
            at(() => ['field', 'subField'], composableReducer)(trackingState);
            expect(composableReducer).toBeCalled();
            expect(path).toEqual(['field', 'subField']);
          });
        });
      });

      describe('when composed', () => {
        it('should not path when given path is root', () => {
          let p1;
          const r1 = jest.fn().mockImplementation(
            createReducer(ts => {
              p1 = ts.getPath();
            })
          );

          let p2;
          const r2 = jest.fn().mockImplementation(
            createReducer(ts => {
              p2 = ts.getPath();
            })
          );

          let p3;
          const r3 = jest.fn().mockImplementation(
            createReducer(ts => {
              p3 = ts.getPath();
            })
          );

          at('', at('field', r1, at('subfield', r2)), r3)(trackingState);
          expect(r1).toBeCalled();
          expect(r2).toBeCalled();
          expect(r3).toBeCalled();
          expect(p1).toEqual(['field']);
          expect(p2).toEqual(['field', 'subfield']);
          expect(p3).toEqual([]);
        });
      });
    });
  });
});
