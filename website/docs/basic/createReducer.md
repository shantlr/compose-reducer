---
id: createReducer
title: Create reducers
sidebar_label: Create reducer
---

Here you will see how to create simple reducer with most basic composable-reducers.

## Create reducer

[composeReducer](/docs/api/composeReducer) is the core of compose-reducer, it will allow you to create plain reducer given composable-reducers.

```ts
const reducer = composeReducer(...composableReducers);
```

## Composable-reducer

Composable-reducers are the building blocks that will allow you to create very simple to very complex value reducing logic.
Here we will see the most basic ones.

### Path and value resolver

Composable-reducer implements some behaviour some configuration

### Initialize value

[initState](/docs/api/initState) will initialize state when in-coming state is undefined.

```ts
const initialState = { counter: 0 }

const reducer = composeReducer(
  initState(initialState)
);

// if no state is provided, it will resolve to initialState
reducer(); // { counter: 0 }

// if a state is provided, initState won't do anything and let given state pass through
reducer({ counter: 5 }); // { counter: 5 }
```

### Set value

[setValue](/docs/api/setValue) will allow you to update value at a given path

It expect a [path resolver](/docs/api/pathResolver) and a [value resolver](/docs/api/valueResolver) as arguments

#### Set static value

```ts
const reducer = composeReducer(
  setValue('', 42)
);
reducer(); // 42
```

#### Set dynamic value

```ts
const reducer = composeReducer(
  setValue('', (state, action) => action)
);
reducer(null, 100); // 100
```

#### Set dynamic value at dynamic path

```ts
const reducer = composeReducer(
  setValue(
    (state, action) => `items.${action.id}`,
    (state, action) => action.item,
  )
);

reducer(
  { items: {} },
  { id: 'item1', item: { name: 'Item 1' } }
);
// { items: { item1: { name: 'Item 1' } } }
```

### Unset

### Increment/Decrement value

### Push value(s)

## Pipeline

When [composeReducer](/docs/api/composeReducer) receive several composable-reducer, it pipe them so they are executed in given order.
