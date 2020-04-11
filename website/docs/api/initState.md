---
id: initState
title: Initialize state
sidebar_label: initState
---

Initialize state with resolved value if state is undefined

```ts
initState(
  valueResolver: (state: any, action: any, context: object) => any | any
): ComposableReducer
```

```ts
const reducer = composeReducer(
  initState({ counter: 0 }),
);
reducer(undefined); // { counter: 0 }

// However
reducer(null); // null
reducer(0); // 0
reducer(''); // ''
reducer(false); // false
```
