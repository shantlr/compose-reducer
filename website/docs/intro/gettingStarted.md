---
id: gettingStarted
title: Getting started
sidebar_label: Getting started
---

## Purpose

Reducer function are simple but very powerful tools for value computation. They are very useful in a lots of context, but tends to be very redundant. And as complexty grow, they may get harder to read.

Compose reducer aim to ease writing immutable reducer by lifting some boilerplate block into `composable reducer`. (high order reducer)

## Concept

Compose reducer provide `composable reducer` to handle some very common pattern like updating value at given path.

Those primary building block can be composed to build more advanced block that you can reuse.

## Installation

```bash
# NPM
npm install compose-reducer

# Yarn
yarn add compose-reducer
```
