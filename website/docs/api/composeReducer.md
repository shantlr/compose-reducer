---
id: composeReducer
title: Compose reducer
sidebar_label: composeReducer
---

Create a reducer from a pipeline of composable reducers.
Given composable reducers will be executed in given order, each composable reducer being given previous compute state.

```ts
composeReducer(
  ...composableReducers: ComposableReducer[]
): (state: any, action: any) => any
```
