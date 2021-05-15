// import { getState } from '.';
// import { composeReducer } from './helpers/createReducer';
// import { at } from './reducers/context/at';
// import { branchAction } from './reducers/flow/branchAction';
// import { incValue } from './reducers/value/incValue';
// import { initState } from './reducers/value/initState';
// import { setValue } from './reducers/value/setValue';
// import { ValueAtPath } from './utils/get';

// const reducer = composeReducer(
//   initState(
//     {
//       // hello: 1,
//       world: {
//         test: 5
//       }
//       // world: {
//       //   test: 'hello',
//       //   nb: 5
//       // }
//     }
//     // {
//     //   // a: () => ({
//     //   //   type: 'HELLO',
//     //   //   test: 1
//     //   // }),
//     //   // b: () => ({
//     //   //   type: 'TEST',
//     //   //   numb: 'hello world'
//     //   // })
//     // }
//   ),
//   // actionHint({
//   //   a: () => ({
//   //     type: 'HELLO'
//   //   }),
//   //   test: () => ({
//   //     type: 'TES'
//   //   })
//   // }),
//   setValue(
//     (state, action) => {
//       if (action.type === 'HELLO') {
//         console.log(action);
//       }
//       return 'hello';
//     },
//     () => true
//   ),
//   at(
//     'world',
//     incValue('nb', (state, action) => 1)
//     // incValue<{ test: string }, any>('test', (state, action) => 1)
//   )
//   // incValue('hello', (state, action) => 1)
// );

// // type State = {
// //   world: {
// //     k: 'hello';
// //   };
// // };
// // type Action = any;
// // at<State, Action, 'world'>(
// //   'world',
// //   incValue('', () => 1)
// // );

// // reducer();

// type A = {
//   world: {
//     test: 'hello';
//   };
// };

// type B = ValueAtPath<A, 'world'>;
