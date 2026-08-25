---
name: task-planning
description: Plan development work by combining project memory (Engram or another memory MCP), CodeGraph repository intelligence when available, and Context7 documentation before delegation.
---

# Task Planning

The orchestrator must gather enough context before delegating non trivial implementation.

## Discovery order

1. Memory MCP tools (e.g. Engram): recover project history, decisions, constraints, and previous work. Skip if no memory MCP tools are present.
2. CodeGraph: identify affected symbols, dependencies, callers, and architectural impact. **Skip entirely if the `codegraph` CLI/MCP tool is not available** (do not treat this as an error) — fall back to Read/Grep/Glob. If it is available but no `.codegraph/` index exists yet, initialize it before relying on it.
3. Context7: verify external APIs, frameworks, libraries, SDKs, and version specific behavior when relevant.
4. Open web/document research (investigator subagent): only for questions 1–3 can't answer — comparing approaches, an unfamiliar third-party service or spec, a URL supplied by the user. Do not use it as a substitute for Context7 when the question is really about a known library's own docs.

Do not blindly execute this sequence when a tool is irrelevant or unavailable.

## Planning

Produce a concise implementation plan containing:

    - objective
    - affected components
    - relevant existing behavior
    - constraints and previous decisions
    - external API or framework requirements
    - implementation steps
    - tests and verification
    - risks or architectural impact

## Delegation

Delegate only after sufficient context has been gathered.

Give executors the relevant findings instead of requiring them to repeat discovery.

Keep executor tasks focused and independently actionable.

Do not delegate orchestration decisions to implementation agents.

## Simple tasks

For trivial changes, avoid unnecessary tool calls and planning overhead.

The mandatory knowledge workflow applies to non trivial work.

## Rules

    - Do not invent findings from tools that were not used.
    - Prefer targeted retrieval.
    - Do not overload the executor with irrelevant repository or documentation context.
