---
id: mapAction
title: Mapping Action
sidebar_label: Mapping action
---

To actually be able to reuse some composable reducer, it may be needed to adapt input action signature to expected signature.

```ts
// expect a task as action and push it into task list
const addTask = composable(
  pushValue('task.list')
)

const reducer = composeReducer(
  initState({ task: { list: [] } }),
  branchActions({
    ADD_TASK: mapAction(
      // map ADD_TASK action into a task so we can use addTask
      (state, action) => action.task,
      addTask,
    ),
    ADD_MANY_TASK: mapActions(
      (state, action) => action.tasks,
      // map ADD_MANY_TASK action into an array of task
      // each task will be forwarded to addTask
      addTask,
    )
  })
);
```

See [mapAction](), [mapActions]()