---
name: code-intelligence
description: Use CodeGraph to understand repository structure, symbols, dependencies, callers, and architectural impact before modifying existing code.
---

# Code Intelligence

CodeGraph is the repository structural intelligence layer, when it is available.

## Availability check (mandatory, first)

Before anything else, check whether the `codegraph` CLI/MCP tool is available at all (a `codegraph` binary on PATH, or `mcp__codegraph__*` tools present). This plugin attempts to install it automatically on session start, but that install can fail (offline, no npm, no permission to install globally).

- If it is **not** available: skip CodeGraph entirely for the rest of the task. Fall back to Read/Grep/Glob. This is not an error and should not block the task.
- If it **is** available but the project has no `.codegraph/` index yet: the orchestrator agent (not a coding subagent) is responsible for running `codegraph init` before implementation starts. If you are operating without the orchestrator, initialize it yourself before proceeding.
- Only once the tool is confirmed available (and initialized), proceed to the workflow below.

## Before modifying existing code

Use CodeGraph to determine:

1. Where the relevant functionality is implemented.
2. Which symbols, classes, functions, interfaces, or modules are involved.
3. Who calls or depends on the affected code.
4. What the affected code depends on.
5. Whether the change crosses architectural or module boundaries.
6. Whether similar implementations already exist.

Prefer targeted graph queries over manually reading unrelated files.

## Impact analysis

For non trivial changes establish:

    - affected symbols
    - callers
    - dependencies
    - implementations
    - inheritance or interface relationships
    - relevant tests
    - potentially affected modules

## Planning

Use CodeGraph findings to decide:

    - which files need inspection
    - which executor should receive the task
    - whether the change is local or cross cutting
    - whether additional tests are required
    - whether architectural review is necessary

Pass relevant structural findings to executors.

## Verification

Use CodeGraph again when changes modify:

    - public interfaces
    - dependencies
    - module boundaries
    - shared services
    - inheritance
    - event flows
    - database relationships
    - API relationships

Verify that the resulting structure matches the intended design.

## Rules

    - Do not blindly modify code based only on filename search.
    - Do not load the entire repository when targeted graph queries can answer the question.
    - Never claim CodeGraph was used unless it was actually invoked.
    - Never fail or block a task solely because CodeGraph is unavailable — fall back to Read/Grep/Glob and continue.
