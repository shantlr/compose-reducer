# compose-reducer

Compose-reducer helps you create less verbose and more expressive reducer.

Compose-reducer 

- [compose-reducer](#compose-reducer)
  - [Install](#install)
  - [Api](#api)
    - [composeReducer](#composereducer)
    - [Composable Reducer](#composable-reducer)
    - [Value composable reducer](#value-composable-reducer)
      - [setValue](#setvalue)
      - [unsetValue](#unsetvalue)
      - [incValue](#incvalue)
      - [decValue](#decvalue)
      - [pushValue](#pushvalue)
      - [pushValues](#pushvalues)
      - [popValues](#popvalues)
    - [Flow composable reducer](#flow-composable-reducer)
      - [branch](#branch)
      - [branchAction](#branchaction)
    - [mapAction](#mapaction)
    - [mapActions](#mapactions)
      - [onEach](#oneach)
    - [Context](#context)
      - [withContext](#withcontext)
      - [at](#at)

## Install

`yarn add compose-reducer`

## Api

### `composeReducer`

This function create a reducer with given pipeline of [composable reducer](#composable-reducer)

```ts
  composeReducer(...composableReducers: ComposableReducer[]): (state: State, action: Action) => State
```

Composable reducer will be applied in given order.

```ts
import { composeReducer, incValue } from 'compose-reducer';

const reducer = composeReducer(
  incValue('counter1', 1),  // increase counter1 field by 1
  incValue('counter2', 10), // then increase counter2 field by 10
  incValue('counter1', 5),  // then increase counter1 field by 5
);

const initalState = { counter1: 0, counter2: 2 };
reducer(initialState); // { counter1: 6, counter2: 12 }
```

### Composable Reducer

Composable reducer are meant to be used within [composeReducer](#composereducer).

### Value composable reducer

#### `setValue`

Set resolved value at resolved path.

Resolved path may be a static string or a function that will compute path given state and action.

Resolved value may be a static value (non function value) or a function that will compute path given state and action.

```ts
setValue(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  valueResolver?: (state: any, action: any, context: object) => any | any
): ComposableReducer
```

```ts
import { composeReducer, setValue } from 'compose-reducer';

const reducer = composeReducer(
  setValue('field.nestedField', 'hello world')
);

const initialState = {};
reducer(initialState); // { field: { nestedField: 'hello world' } }

//  equivalent to (dynamic path)
composeReducer(
  setValue(
    (state, action) => 'field.nestedField',
    'hello world'
  )
);

// equivalent to (dynamic value)
composeReducer(
  setValue(
    'field.nestedField',
    (state, action) => 'hello world'
  )
);

// In case value resolver is not provided, value will be resolved to given action
const setSizeReducer = composeReducer(
  setValue('size')
);
setSizeReducer({ size: 0 }, 10) // { size: 10 }
```

#### `unsetValue`

```ts
unsetValue(
  pathResolver: string | (state: any, action: any, context: object) => string
): ComposableReducer
```

```ts
import { composeReducer, unsetValue } from 'compose-reducer';

const reducer = composeReducer(
  unsetValue('entities.1')
)

const initalState = { entites: { 1: { id: '1' }, 42: { id: '42' } } };
reducer(initialState) // { entites: { 42: { id: '42' } } }

// equivalent to (dynamic path)
const reducer = composeReducer(
  unsetValue(
    (state, action) => 'entites.1',
  )
)
```

#### `incValue`

```ts
incValue(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  incValueResolver: number | (state: any, action: any, context: object) => number
): ComposableReducer
```

```ts
import { composeReducer, incValue } from 'compose-reducer';

const reducer = composeReducer(incValue('counter', 1));
const initialState = { counter: 0 };
reducer(initialState); // { counter: 1 }

// equivalent to (dynamic path)
composeReducer(incValue(
  (state, action) => 'counter',
  1
));

// equivalent to (dynamic value)
composeReducer(incValue(
 'counter',
 (state, action) => 1,
));

// equivalent to (dynamic path and value)
composeReducer(incValue(
 (state, action) => 'counter',
 (state, action) => 1,
));
```

#### `decValue`

```ts
decValue(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  decValueResolver: number | (state: any, action: any, context: object) => number
): ComposableReducer
```

```ts
import { composeReducer, decValue } from 'compose-reducer';

const reducer = composeReducer(decValue('counter', 1));
const initialState = { counter: 0 };
reducer(initialState); // { counter: -1 }

// equivalent to (dynamic path)
composeReducer(decValue(
  (state, action) => 'counter',
  1
));

// equivalent to (dynamic value)
composeReducer(decValue(
 'counter',
 (state, action) => 1,
));

// equivalent to (dynamic path and value)
composeReducer(decValue(
 (state, action) => 'counter',
 (state, action) => 1,
));
```

#### `pushValue`

```ts
pushValue(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  pushedValueResolver: (state: any, action: any, context: object) => any | any
): ComposableReducer
```

```ts
import { composeReducer, pushValue } from 'compose-reducer';

const reducer = composeReducer(pushValue('array', 10));
const initialState = { array: null };
const nextState = reducer(initialState); // { array: [10] }
reducer(nextState) // { array: [10, 10] }

// equivalent to (dynamic path)
composeReducer(pushValue(
  (state, action) => 'array',
  10
));

// equivalent to (dynamic value)
composeReducer(pushValue(
 'array',
 (state, action) => 10,
));

// equivalent to (dynamic path and value)
composeReducer(pushValue(
 (state, action) => 'array',
 (state, action) => 10,
));
```

#### `pushValues`

```ts
pushValues(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  pushedValuesResolver: (state: any, action: any, context: object) => any[] | any
): ComposableReducer
```

```ts
import { composeReducer, pushValues } from 'compose-reducer';

const reducer = composeReducer(pushValues('array', [1, 2, 3]));
const initialState = { array: null };
const nextState = reducer(initialState); // { array: [1, 2, 3 }
reducer(nextState) // { array: [1, 2, 3, 1, 2, 3] }

// equivalent to (dynamic path)
composeReducer(pushValues(
  (state, action) => 'array',
  [1, 2, 3]
));

// equivalent to (dynamic value)
composeReducer(pushValues(
 'array',
 (state, action) => [1, 2, 3],
));

// equivalent to (dynamic path and value)
composeReducer(pushValues(
 (state, action) => 'array',
 (state, action) => [1, 2, 3],
));
```

#### `popValues`

```ts
popValues(
  pathResolver: string | string[] | ((state: any, action: any, context: object) => string | string[])
  popedValueIndexesResolver: number | number[] | ((state: any, action: any, context: object) => number| number[])
): ComposableReducer
```

```ts
import { composeReducer, popValues } from 'compose-reducer';

// reducer that will remove elem at index 1 of field 'array'
const reducer = composeReducer(popValues('array', 1));
reducer({ array: ['hello', 'world', 'hel', 'wor'] }); // { array: ['hello', 'hel', 'wor']}
// ignore if out of range
reducer({ array: [] }); // { array: [] }

// reducer that will remove elem at index 1, 2 and 3 of field 'array'
const reducer2 = composeReducer(popValues('array', [1, 2, 3]));
reducer2({ array: ['hello', 'world', 'hel', 'wor'] }); // { array: ['hello']}
// ignore out of range indexes
reducer2({ array: ['hello', 'world'] }); // { array: ['hello']}
```

### Flow composable reducer

#### `branch`

```ts
branch(
  predicate: (state: any, action: any, context: object) => boolean
  trueReducer?: ComposableReducer
  falseReducer?: ComposableReducer
): ComposableReducer
```

#### `branchAction`

```ts
branchAction(
  ...branches: Map<string, ComposableReducer>
               | [...(string | (state: any, action: any, context: object) => bool), ComposableReducer]
): ComposableReducer
```

```ts
import { composeReducer, branchAction, incValue, decValue } from 'compose-reducer';

const reducer = composeReducer(branchAction({
  INC_COUNTER: incValue('counter', 1),
  DEC_COUNTER: decValue('counter', 1),
}));

const initialState = { counter: 0 }
reducer(initialState, { type: 'INC_COUNTER' }) // { counter: 1 }
reducer(initialState, { type: 'DEC_COUNTER' }) // { counter: -1 }

// equivalent to
composeReducer(branchAction(
  ['INC_COUNTER', incValue('counter', 1)],
  ['DEC_COUNTER', decValue('counter', 1)],
));

// equivalent to
composeReducer(branchAction(
  [(state, action) => action.type === 'INC_COUNTER', incValue('counter', 1)],
  [(state, action) => action.type === 'DEC_COUNTER', decValue('counter', 1)],
))
```

Array branching may have a liste of action type or predicate before the actual reducer
Type and predicate of a same stage will apply reducer only once

```ts
const reducer = composeReducer(branchAction(
  [(state, action) => action.type === 'INC_COUNTER', 'INC_COUNTER', 'INCREASE', incValue('counter', 1)]
));
const initalState = { counter: 0 };
reducer(initialState, 'INC_COUNTER'); // { counter: 1 }
reducer(initialState, 'INCREASE'); // { counter: 1 }
```

In case predicate match in different stages, each reducer will be applied

```ts
const reducer = composeReducer(branchAction(
  [(state, action) => action.type === 'INC_COUNTER', incValue('counter', 1)],
  ['INC_COUNTER', 'INCREASE', incValue('counter', 1)]
));

const initalState = { counter: 0 }
reducer(initialState, { type: 'INC_COUNTER' }); // { counter: 2 }
reducer(initialState, { type: 'INCREASE' }); // { counter: 1 }
```

### `mapAction`

Apply all given composable reducer with resolved value as action.

This may be usefull to map input state/action for easier reducer reusability.

```ts
mapAction(
  actionResolver: any | (state: any, action: any, context: object) => any,
  ...composableReducers: ComposableReducer[]
): ComposableReducer
```

```ts
import { composeReducer, mapAction, setValue } from 'compose-reducer';

const reducer = composeReducer(
  mapAction(
    (state, action) => action.payload,
    setValue('field') // received action will be field 'payload' of initial action
  ),
)

reducer({ field: 0 }, { payload: 100 }) // { field: 100 }
```

### `mapActions`

Apply all given composable reducers on each resolved action

```ts
mapActions(
  actionResolver: any | (state: any, action: any, context: object) => any[],
  ...composableReducers: ComposableReducer[]
): ComposableReducer
```

```ts
import { composeReducer, mapActions, setValue, pushValue } from 'compose-reducer';

const reducer = composeReducer(
  mapActions(
    (state, action) => action.items,
    setValue(
      (state, action) => ['entities', action.id],
    ),
    pushValue(
      'ids',
      (state, action) => action.id,
    )
  )
)

reducer({ entities: {}, ids: [] }, { items: [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }] })
// {
//   entities: { 1: { id: 1, name: 'item 1' }, 2: { id: 2, name: 'item 2' }, 3: { id: 3, name: 'item 3' } } }
//   ids: [1, 2, 3]
// }
```

#### `onEach`

Alias of [withActions](#withactions)

```ts
import { composeReducer, onEach, setValue, pushValue } from 'compose-reducer';

const reducer = composeReducer(
  onEach(
    (state, action) => action.items,
    setValue(
      (state, action) => ['entities', action.id],
    ),
    pushValue(
      'ids',
      (state, action) => action.id,
    )
  )
)

reducer({ entities: {}, ids: [] }, { items: [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }] })
// {
//   entities: { 1: { id: 1, name: 'item 1' }, 2: { id: 2, name: 'item 2' }, 3: { id: 3, name: 'item 3' } } }
//   ids: [1, 2, 3]
// }
```

### Context

In some cases it is convenient to be able to reuse a previously computed value in multiple sub reducer.
This is possible through context.

#### `withContext`

Add some values to context

Added values are scoped, only accessible in sub (given) composableReducers

```ts
withContext(
  contextResolver: (state: any, action: any, context: object) => object | object,
  ...composableReducers: ComposableReducer[]
): ComposableReducer
```

```ts
import { composeReducer, withContext, setValue, pushValue } from 'compose-reducer';

const reducer = composeReducer(
  withContext(
    (state, action) => ({
      id: `${action.payload.type}::${action.payload.id}`,
    }),
    setValue(
      (state, action, context) => ['entities', context.id],
      (state, action) => action.payload,
    ),
    pushValue(
      (state, action) => ['ids', action.payload.type],
      (state, action, context) => context.id,,
    )
  ),
)

const initialState = { entites: { 'car:1': { id: 1, type: 'car', name: '#001'  } }, ids: { car: ['car:1'] } }
reducer(initialState, { payload: { type: 'bus', id: 1, name: '#001' } })
// {
//    entities: { 'car:1': { ... }, 'bus:1': { type: 'bus', id: 1, name: '#001' } }
//    ids: { car: ['car:1'], bus: ['bus:1'] }
// }
```

#### `at`

`at` update a builtin context variable that is used as root path for each provided value composable reducer

Resolved path is scoped and added to current path, only sub (given) composable reducers will work on new current path

```ts
at(
  pathResolver: string | (state: any, action: any, context: object) => string,
  ...composableReducers: ComposableReducer[]
): ComposableReducer
```

```ts
import { composeReducer, at, incValue } from 'compose-reducer';

const reducer = composeReducer(
  at(
    'field',
    incValue('counter', 10) // will be applied to 'field'
    at(
      'subfield',
      incValue('counter', 200), // will be applied to 'field.subfield'
    )
  ),
  incValue('counter', 5) // is not affected by at
)

reducer({ counter: 0, field: { counter: 0, subfield: { counter: 0 } } }) // { counter: 5, field: { counter: 10, subfield: { counter: 200 } }  }
```
