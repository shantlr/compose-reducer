---
id: pathResolver
title: Path resolver
sidebar_label: pathResolver
---

```ts
type PathResolver =
  | string
  | string[]
  | ((state: any, action: any, context: object) => string | string[]);
```

```ts
const staticStringPathResolver = 'field.nestedField';
// equivalent to
const staticArrayPathResolver = ['field', 'nestedField'];
// equivalent to
const dynamicStringPathResolver = (state, action, context) =>
  'field.nestedField';
// equivalent to
const dynamicArrayPathResolver = (state, action, context) => [
  'field',
  'nestedField'
];
```

## Empty path

```ts
type RootPath = [] | '';
```
