---
id: mapActions
title: Map actions
sidebar_label: mapActions
---

Use resolved values as actions for given composable reducers.

```ts
type ActionsResolver<T> = Array<T> | (state: any, action: any, context: object) => Array<T>
```

```ts
mapActions<T>(
  actionsResolver: ActionsResolver<T>,
  ...composableReducers: ComposableReducer[]
): ComposableReducer;
```

## Usage

```ts
const reducer = composeReducer(
  mapActions((state, action) => action, incValue('sum')),
  setValue('lastAction')
);

reducer({ sum: 0, lastAction: null }, [1, 2, 3]);
// { sum: 6, lastAction: [1, 2, 3] }
```
