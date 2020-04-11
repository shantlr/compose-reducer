---
id: subState
title: State splitting
sidebar_label: Split state
---

When state grow more complex it is often easier ta manage by splitting it into sub state`

Compose-reducer provide two main

## Composable

[`composable`]() create a pipe of composable reducers into a single composable reducer

```ts
const itemReducer = composable(
  initState({ list: [] }),
)

const orderReducer = composable(
  initState({  })
)

const reducer = composeReducer(
  at('item', itemReducer),
  at('order', orderReducer)
);

reducer();
```
