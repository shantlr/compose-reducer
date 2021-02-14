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

Most composable reducer use [pathReducer](/docs/api/pathResolver) and [valueReducer](/docs/api/valueResolver) as arguments.

### Initialize value

[initState](/docs/api/initState) will initialize state when in-coming state is undefined.

```ts
initState(valueResolver);
```

```ts
const initialState = { counter: 0 };

const reducer = composeReducer(initState(initialState));

// if no state is provided, it will resolve to initialState
reducer(); // { counter: 0 }

// if a state is provided, initState won't do anything and let given state pass through
reducer({ counter: 5 }); // { counter: 5 }
```

### Set value

[setValue](/docs/api/setValue) will allow you to update value at a given path

It expect a [path resolver](/docs/api/pathResolver) and a [value resolver](/docs/api/valueResolver) as arguments

```ts
setValue(pathResolver, valueResolver);
```

#### Set static value

```ts
const reducer = composeReducer(setValue('', 42));
reducer(); // 42
```

#### Set dynamic value

```ts
const reducer = composeReducer(setValue('', (state, action) => action));
reducer(null, 100); // 100
```

#### Set dynamic value at dynamic path

```ts
const reducer = composeReducer(
  setValue(
    (state, action) => `items.${action.item.id}`,
    (state, action) => action.item
  )
);

reducer({ items: {} }, { item: { id: 'id1', name: 'Item 1' } });
// { items: { id1: { id: 'id1', name: 'Item 1' } } }
```

### Unset value

[unsetValue](/docs/api/unsetValue) work much the same way as [setValue](/docs/api/setValue).

```ts
unsetValue(pathResolver);
```

```ts
const reducer = composeReducer(unsetValue(''));

reducer(null); // undefined
reducer({ hello: 'world' }); // undefined
```

```ts
const reducer = composeReducer(unsetValue('field1'));

reducer({ field1: 'hello', field2: 'world' }); // { field2: 'world }
```

```ts
const reducer = composedReducer(unsetValue(['field1', '']));
```

### Increment/Decrement value

```ts
incValue(pathResolver, valueResolver);
decValue(pathResolver, valueResolver);
```

```ts
const reducer = composeReducer(incValue('', 1));

reducer(null); // 1
reducer(2); // 3
reducer(100); // 101
```

```ts
const reducer = composeReducer(incValue('counter', 5));

reducer(null); // { field: 5 }
reducer({ counter: 10 }); // { counter: 15 }
```

### Push/pop value(s)

```ts
pushValue(pathResolver, valueResolver);
pushValues(pathResolver, valuesResolver);
popValue(pathResolver, indexResolver);
```

## Pipeline

When [composeReducer](/docs/api/composeReducer) receive several composable-reducer, it pipe them so they are executed in given order.

```ts
const reducer = composeReducer(
  pushValue('items', (state, action) => action.item)
  incValue('counter', 1),
);

reducer({ counter: 0, items: [] }, { item: { id: 'id1' } });
// { counter: 1, items: [{ id; 'id1' }] }
```
