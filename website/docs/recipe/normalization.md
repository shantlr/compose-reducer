---
id: normalization
title: Normalization
sidebar_label: Normalization
---

```ts
const reducer = composeReducer(
  onEach(
    (state, action) => action.entities,
    // next composable reducers will be called with each entity as value

    setValue(
      (state, action) => ['entities', action.id], // dynamically compute path
      // if value resolver is not provided, action will be used as value
    ),

    // we also push each entity id into 'ids' field
    pushValue('ids', (state, action) => action.id)
  )
)

// equivalent to
(state, action) => {
  return {
    ...state,
    entities: action.entities.reduce((entities, entity) => {
      return {
        ...entities,
        [entity.id]: entity,
      }
    }, state.entities),
    ids: state.ids.concat(action.entities.map(({ id }) => id))
  }
}
```
