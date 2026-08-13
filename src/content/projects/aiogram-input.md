---
title: aiogram-input
summary: PyPI library that waits for the next Telegram message inside an aiogram handler, with memory or Redis storage and CI.
category: Developer tooling
repo: https://github.com/mamahoos/aiogram-input
stack:
  - Python
  - aiogram
  - Redis
featured: true
order: 4
---

## Problem

Short prompts (a phone number, a confirmation, a one-time code) do not deserve a full FSM. Handlers need `send question → await reply → continue`, with a timeout and without stealing unrelated updates.

## Architecture

`setup_input` registers on the Dispatcher and injects an `InputWaiter` through aiogram DI. `MemoryInputStorage` is for a single process. `RedisInputStorage` shares wait markers across workers; the awaiting coroutine still lives on the worker that called `wait()`.

## Decisions

- Redis stores markers only, with TTL so abandoned waits expire.
- Keep FSM and other handlers in the path for unrelated updates.
- Publish on PyPI and run unit plus Redis integration workflows.
