# compose-reducer

[WIP]

Compose-reducer helps you create less verbose and more expressive reducer.

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
      - [normalize](#normalize)
    - [Flow composable reducer](#flow-composable-reducer)
      - [branch](#branch)
      - [branchAction](#branchaction)
    - [Context](#context)
      - [setContext](#setcontext)
      - [scope](#scope)

## Install

...

## Api

### `composeReducer`

This function create a reducer with given pipeline of [composable reducer](#composable-reducer)

```ts
  composeReducer(...composableReducers: ComposableReducer[]): (state: State, action: Action) => State
```

Composable reducer will be applied in given order.

```ts
  const reducer = composeReducer(
    incValue('counter1', 1),  // increase counter1 field by 1
    incValue('counter2', 10), // then increase counter2 field by 10
    incValue('counter1', 5),  // then increase counter1 field by 5
  );

  const initalState = { counter1: 0, counter2: 2 };
  const nextState = reducer(initialState);
  // nextState === { counter1: 6, counter2: 12 }
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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  valueResolver?: (state: Object, action: Object) => any | any
): ComposableReducer
```

```ts
import { composeReducer, setValue } from '@shantry/compose-reducer';

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
    (state, action) =>s 'hello world'
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
  pathResolver: String | () => String
): ComposableReducer
```

```ts
import { composeReducer, unsetValue } from '@shantry/compose-reducer';

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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  incValueResolver: (state: Object, action: Object) => any | any
): ComposableReducer
```

```ts
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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  decValueResolver: (state: Object, action: Object) => any | any
): ComposableReducer
```

```ts
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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  pushedValueResolver: (state: Object, action: Object) => any | any
): ComposableReducer
```

```ts
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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  pushedValuesResolver: (state: Object, action: Object) => any[] | any
): ComposableReducer
```

```ts
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
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  popedValueIndexesResolver: number | number[] | ((state: Object, action: Object) => number| number[])
): ComposableReducer
```

```ts
// reducer that will remove elem at index 1 of field 'array'
const reducer = composeReducer(popValues('array', 1));
reducer({ array: ['hello', 'world', 'hel', 'wor'] }); // { array: ['hello', 'hel', 'wor']}
// ignore if out of range
reducer({ array: [] }); // { array: [] }

// reducer that will remove elem at index 1, 2 and 3 of field 'array'
const reducer2 = composeReducer(popValues('array', [1, 2, 3]));
reducer2({ array: ['hello', 'world', 'hel', 'wor'] }); // { array: ['hello']}
// ignore index out of range
reducer2({ array: ['hello', 'world'] }); // { array: ['hello']}
```

#### `normalize`

### Flow composable reducer

#### `branch`

```ts
branch(
  predicate: (state: Object, action: Object) => boolean
  trueReducer?: ComposableReducer
  falseReducer?: ComposableReducer
): ComposableReducer
```

#### `branchAction`

```ts
branchAction(
  ...branches: Map<string, ComposableReducer>
               | [...(string | (state: Object, action: Object) => bool), ComposableReducer]
): ComposableReducer
```

```ts
import { composeReducer, branchAction } from '@shantry/compose-reducer';

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

### Context

#### `setContext`

#### `scope`
