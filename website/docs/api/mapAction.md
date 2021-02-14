---
id: mapAction
title: Map action
sidebar_label: mapAction
---

Use resolved value as action for given composable reducers.

```ts
type ActionResolver = any | (state: any, action: any, context: object) => any
```

```ts
mapAction(
  actionResolver: ActionResolver,
  ...composableReducers: ComposableReducer[]
): ComposableReducer;
```

## Usage

```ts
const reducer = composeReducer(
  mapAction((state, action) => action * 2, incValue('counter1')),
  incValue('counter2')
);

reducer({ counter1: 0, counter2: 0 }, 3);
// { counter1: 6, counter2: 3 }
```
