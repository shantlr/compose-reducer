---
id: branch
title: Branch
sidebar_label: branch
---

```ts
type Predicate = (state: any, action: any, context: any) => boolean;
```

```ts
branch(
  predicate: Predicate,
  reducerToCallWhenTrue: ComposableReducer,
  reducerToCallWhenFalse: ComposableReducer,
): ComposableReducer;
```

See [Basic](/docs/basic/branching#if-else)
