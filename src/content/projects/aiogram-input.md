---
title: aiogram-input
summary: Wait for the next Telegram message inside a handler without a full FSM — and without stealing unrelated updates.
type: library
category: Concurrency
repo: https://github.com/mamahoos/aiogram-input
stack:
  - Python
  - aiogram
  - Redis
featured: true
order: 6
---

A Telegram bot handler looks sequential:

```python
await bot.send_message(...)
answer = await input.wait(...)
```

Updates are not sequential. While one coroutine is waiting, other chats and other handlers still receive events.

The library has to answer:

> Which update belongs to which waiting handler?

A phone number or a one-time code does not deserve a full FSM. It does deserve a timeout, a filter, and a guarantee that unrelated messages still reach their handlers.

## How a wait is resolved

```text
User ──► Bot ──► Dispatcher
                    │
                    ├── InputMiddleware
                    │       │
                    │       ▼
                    │   SessionManager.feed()
                    │       │
                    │       ├── no local wait  →  pass through
                    │       ├── filter reject  →  pass through
                    │       └── match wait_id  →  set_result, stop chain
                    │
                    └── InputWaiter injected via DI
```

`setup_input(dispatcher)` registers outer middleware and puts an `InputWaiter` in handler data (same idea as `FSMContext`).

`wait()` creates a `wait_id`, stores a marker, and `asyncio.wait_for`s a Future. Timeout returns `None` and always cleans up.

A second `wait()` on the same chat cancels the previous Future after the new marker is persisted.

## Memory vs Redis

Redis does **not** hold the coroutine, the filter, or the `Message`.

| | Memory | Redis |
|---|---|---|
| Process-local | Yes | Marker only |
| Multi-worker visibility | No | Yes (markers) |
| Persistence | No | Marker + TTL |
| Awaiting coroutine | Local worker | **Still** local worker |

> **Operational note**
>
> Redis stores coordination state, not the suspended Python coroutine. Only the worker that called `wait()` can resolve it.

`pop_if` on Redis is a Lua compare-and-delete so a stale `wait_id` cannot remove someone else's marker.

## Delivery

Published on PyPI (`aiogram-input`, optional `[redis]` extra).

| Workflow | Evidence |
|---|---|
| Unit | pytest on Python 3.10–3.14, coverage gate 95%, `uv build` |
| Redis | Redis 7 service, `tests/integration` |
| Publish | tag `v*` → `uv publish` |

## What this demonstrates

Concurrency in an event-driven bot: middleware, in-process futures, marker-only shared storage, and an explicit limit — multi-worker setups share *that someone is waiting*, not the wait itself.
