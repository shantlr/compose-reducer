---
id: withContext
title: With context
sidebar_label: withContext
---

Add values to context for given composable reducers

```ts
type ContextResolver = object | (state: any, action: any, context: object) => object
```

```ts
withContext(
  contextResolver: ContextResolver
  ...composableReducers: ComposableReducer[]
)
```

## Usage

```ts
const reducer = composeReducer(withContext((state, action) => ({})));
```
