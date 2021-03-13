// import { getState } from '.';
// import { composeReducer } from './helpers/createReducer';
// import { branchAction } from './reducers/flow/branchAction';
// import { initState } from './reducers/value/initState';
// import { setValue } from './reducers/value/setValue';

// const reducer = composeReducer(
//   initState(
//     {
//       hello: 1
//     },
//     {
//       a: () => ({
//         type: 'HELLO',
//         test: 1
//       }),
//       b: () => ({
//         type: 'TEST',
//         numb: 'hello world'
//       })
//     }
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
//   )
// );

// reducer();
