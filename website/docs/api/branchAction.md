---
id: branchAction
title: Branch action
sidebar_label: branchAction
---

```ts
type Predicate = (state: any, action: any, context: object) => boolean;
type BranchActionCase =
  | { [actionType: string]: ComposableReducer }
  | [...(string | Predicate), ComposableReducer];
```

```ts
branchAction(...BranchActionCase);
```

## Usage

```ts
const reducer = branchAction({
  INC_COUNTER: incValue('counter', 1),
  DEC_COUNTER: incValue('counter', 1)
});

reducer({ counter: 0 }, { type: 'INC_COUNTER' }); // { counter: 1 }
reducer({ counter: 0 }, { type: 'DEC_COUNTER' }); // { counter: -1 }
reducer({ counter: 0 }, { type: 'OTHER' }); // { counter: 0 }
```

```ts
const reducer = branchAction(
  ['INC', 'INC_COUNTER', 'INCREASE_COUNTER', incValue('counter', 1)],
  ['DEC_COUNTER', decValue('counter', 1)]
);
```

All matching case are executed in given order

```ts
const reducer = branchAction(
  ['ADD_ITEM', incValue('counter', 1)],
  ['ADD_ITEM', pushValue('items', (state, action) => action.item)]
);

reducer({ counter: 0, items: [] }, { type: 'ADD_ITEM', item: { id: 'id1' } });
// { counter: 1, items: [{ id: 'id1' }] }
```

See [Basic](/docs/basic/branching#flux-switch)
