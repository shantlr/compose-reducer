---
id: pushValues
title: Push values
sidebar_label: pushValues
---

Push resolved values at [resolved path](/docs/api/pathResolver)

```ts
type ValuesResolver<T> = Array<T> | (state: any, action: any, context: object) => Array<T>;
```

```ts
pushValue(
  pathResolver: PathResolver,
  valuesResolver?: ValuesResolver
): ComposableReducer
```

## Usage

See [Basic](/docs/basic/createReducer#pushpop-values)
