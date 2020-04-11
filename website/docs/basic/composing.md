---
id: composing
title: Composing
sidebar_label: Composing
---

It is possible to compose reducer with custom composable reducer using [`composable`](/docs/api/composable)

`composable` create a composable reducer as pipe of given composable reducers

```ts
const counterReducer = composable()
```
