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
      - [popValue](#popvalue)
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

```js
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

```js
import { composeReducer, setValue } from '@shantry/compose-reducer';

const reducer = composeReducer(setValue('field.nestedField', 'hello world'));

const initialState = {};
const nextState = reducer(initialState);
// nextState === { field: { nestedField: 'hello world' } }
```

Set value using dynamic path and dynamic value:

```js
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

```js
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

```

```

#### `decValue`

```ts
decValue(
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  decValueResolver: (state: Object, action: Object) => any | any
): ComposableReducer
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

#### `popValue`

```ts
popValue(
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  popedValueIndexResolver: (state: Object, action: Object) => number | number
): ComposableReducer
```

#### `popValues`

```ts
popValues(
  pathResolver: string | string[] | ((state: Object, action: Object) => string | string[])
  popedValueIndexesResolver: (state: Object, action: Object) => number[] | number[]
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

```js
import { branchAction } from '@shantry/compose-reducer';

branchAction({
  INC_COUNTER: incValue('counter', 1),
  DEC_COUNTER: decValue('counter', 1),
});

// equivalent to
branchAction(
  ['INC_COUNTER', incValue('counter', 1)],
  ['DEC_COUNTER', decValue('counter', 1)],
);

// equivalent to
branchAction(
  [
    (state, action) => action.type === 'INC_COUNTER', incValue('counter', 1),
    (state, action) => action.type === 'DEC_COUNTER', decValue('counter', 1),
  ]
)
```

### Context

#### `setContext`

#### `scope`
