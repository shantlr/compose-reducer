---
id: popValues
title: Pop values
sidebar_label: popValues
---

Pop values at resolved index(es)

```ts
type IndexResolver =
  | number
  | number[]
  | ((state: any, action: any, context: object) => number | number[]);
```

```ts
pushValue(
  pathResolver: PathResolver,
  indexResolver?: IndexResolver
): ComposableReducer
```

## Usage

See [Basic](/docs/basic/createReducer#pushpop-values)
