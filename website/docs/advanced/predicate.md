---
id: predicate
title: Context branching
sidebar_label: Context branching
---

Predicate take a predicate function and put resolved value into context of all given composable reducers.
You can provide a context field name as first argument to specify which field the value should be put at. (By default a symbol is used)

In combination with `ifTrue` and `ifFalse`, it allow branching in a more expressive way

```ts
const reducer = predicate(
  predicate(
    
  )
)
```
