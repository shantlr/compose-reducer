---
id: setValue
title: Set value
sidebar_label: setValue
---

Set resolved value at resolved

Resolved path may be a static string or a function that will compute path given state and action.

Resolved value may be a static value (non function value) or a function that will compute path given state and action,
when not provided, action it will be resolved as value

```ts
setValue(
  pathResolver: PathResolver
  valueResolver?: ValueResolver
): ComposableReducer
```

## Usage

### Static set value

```ts
const reducer = composeReducer(
  setValue('field.nested', 'hello world')
);

const initialState = {};
reducer(initialState); // { field: { nested: 'hello world' } }
```

### Set value using a dynamic path

```ts
//  equivalent to (dynamic path)
composeReducer(
  setValue((state, action) => 'field.nestedField', 'hello world')
);
```

### Set dynamic value

```ts
const reducer = composeReducer(
  setValue('field.nestedField', (state, action) => 'hello world')
);
```

### Action as value

```ts
// In case value resolver is not provided, value will be resolved to given action
const reducer = composeReducer(
  setValue('size')
);
reducer({ size: 0 }, 10); // { size: 10 }
```
