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
  valueResolver: (state: Object, action: Object) => any | any
): ComposableReducer
```

Set value using static path and static value:

```ts
import { composeReducer, setValue } from '@shantry/compose-reducer';

const reducer = composeReducer(setValue('field.nestedField', 'hello world'));

const initialState = {};
const nextState = reducer(initialState);
// nextState === { field: { nestedField: 'hello world' } }
```

Set value using dynamic path and dynamic value:

```ts
import { composeReducer, setValue } from '@shantry/compose-reducer';

const reducer = composeReducer(
  setValue(
    (state, action) => ['entites', action.payload.item.id],
    (state, action) => action.payload.item,
  )
)

const initalState = { entites: { 1: { id: '1' } } };
const nextState = reducer(initialState, { payload: { item: { id: '42' } } })
// nextState === { entites: { 1: { id: '1' }, 42: { id: '42' } } }
```

#### `unsetValue`

```ts
unsetValue(
  pathResolver: String | () => String
): ComposableReducer
```

Static path

```ts
import { composeReducer, unsetValue } from '@shantry/compose-reducer';

const reducer = composeReducer(
  unsetValue('entities.1')
)

const initalState = { entites: { 1: { id: '1' }, 42: { id: '42' } } };
const nextState = reducer(initialState)
// nextState === { entites: { 42: { id: '42' } } }
```

Dynamic path

```js
import { composeReducer, unsetValue } from '@shantry/compose-reducer';

const reducer = composeReducer(
  unsetValue(
    (state, action) => ['entites', action.payload.itemId],
  )
)

const initalState = { entites: { 1: { id: '1' }, 42: { id: '42' } } };
const nextState = reducer(initialState, { payload: { itemId: '1' } })
// nextState === { entites: { 42: { id: '42' } } }
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

// equivalent to
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

// equivalent to
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

#### `pushValues`

```ts
pushValues(
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  pushedValuesResolver: (state: Object, action: Object) => any[] | any
): ComposableReducer
```

#### `popValues`

```ts
popValues(
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  popedValueIndexesResolver: number | number[] | ((state: Object, action: Object) => number| number[])
): ComposableReducer
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
