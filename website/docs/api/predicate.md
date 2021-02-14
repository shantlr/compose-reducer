---
id: predicate
title: Predicate
sidebar_label: predicate
---

Do branching logic in a more declaritive way through context.

`predicate` put resolved boolean in context so it can be used in conjonction with `ifTrue` and `ifElse`

An optionnal context field name can be provided to enforce where the boolean is stored in context (by default an internal symbol is used)

```ts
type Predicate: (state: any, action: any, context: object) => boolean
```

```ts
predicate(
  predicate: Predicate,
  ...composableReducers: ComposableReducer[]
): ComposableReducer

predicate(
  contextFieldName: string,
  predicate: Predicate,
  ...composableReducers: ComposableReducer[]
): ComposableReducer
```

```ts
ifTrue(...composableReducers: ComposableReducer[]): ComposableReducer
ifTrue(contextFieldName: string, ...composableReducers: ComposableReducer[]): ComposableReducer
```

```ts
ifFalse(...composableReducers: ComposableReducer[]): ComposableReducer
ifFalse(contextFieldName: string, ...composableReducers: ComposableReducer[]): ComposableReducer
```

## Usage

```ts
const reducer = composedReducer(
  predicate(
    (state, action) => action.length > 100,
    ifTrue(pushValue('longTexts'))
    ifFalse(pushValue('shortTexts'))
  )
);

reducer({
  shortTexts: [],
  longTexts: [],
}, 'lorem ipsum');
```

See [Basic](/docs/basic/branching#if-else)
