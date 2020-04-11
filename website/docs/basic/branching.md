---
id: branching
title: Branching
sidebar_label: Branching
---

## If else

Simple `if else` conditional statements may be simulated using [`branch`](/docs/api/branch)

```ts
const reducer = composeReducer(
  branch(
     // condition
    (state, action) => action.sign === 'NEGATIVE',
    // if true subtract value
    decValue('counter', (state, action) => action.value),
    // else add value
    incValue('couter', (state, action => action.value))
  )
)
reducer({ counter: 0 }, { sign: 'NEGATIVE', value: 5 }) // { counter: -5 }
reducer({ counter: 0 }, { sign: 'POSITIVE', value: 5 }) // { counter: 5 }
```

Branching can be made in a more expressive way using [predicate](/docs/advanced/predicate)

```ts
const reducer = composeReducer(
  predicate(
    (state, action) => action.sign === 'NEGATIVE',
    ifTrue(
      decValue('counter', (state, action) => action.value)
    ),
    ifFalse(
      incValue('counter', (state, action) => action.value)
    ),
  )
)
```

## Switch

```ts
const reducer = composeReducer(
  branchAction(
    ['']
  )
)
```

## Flux switch

```ts
const reducer = composeReducer(
  branchAction({
    
  })
)
```

---

See [Context branching](/docs/advanced/predicate) for more advanced branching