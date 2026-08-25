---
name: project-context
description: Recover and persist project knowledge through the available memory MCP tools (e.g. Engram). Use before non trivial development work and after significant discoveries or changes.
---

# Project Context

A memory MCP server (Engram is this plugin's force-installed reference backend, via `mem_save`/`mem_search`/`mem_context`/etc.) is the persistent memory layer for the project. If no memory MCP tools are present in a given session, skip this skill entirely rather than treating it as an error.

## Before work

For every non trivial task, if memory MCP tools are available:

1. Search memory (`mem_search`) for the project, relevant feature, component, bug, decision, or previous implementation.
2. Retrieve the most relevant observations rather than loading the entire project history.
3. Identify previous decisions, constraints, failed approaches, conventions, and unfinished work.
4. Use recovered information to influence planning.
5. Never assume conversation history is the complete project history.

## During work

Save important information when it becomes stable or useful beyond the current task:

    - architectural decisions
    - implementation decisions
    - discovered constraints
    - non obvious behavior
    - important bugs and their causes
    - failed approaches
    - workarounds
    - configuration requirements
    - completed features
    - significant refactors

Do not save trivial intermediate reasoning.

## Context reset

After context compaction, reset, or loss of previous conversation state:

1. Call mem_context (or the equivalent recovery tool for whichever memory MCP is installed).
2. Recover the current project state.
3. Search memory for the active task before continuing.
4. Do not continue based on assumptions from lost context.

## Delegation

The orchestrator owns memory retrieval. Executors should receive relevant recovered context when it affects implementation.

## Persistence

When a significant task finishes, save a concise durable record containing:

    - what changed
    - why
    - important decisions
    - relevant components
    - verification performed
    - remaining issues

Never claim information was saved unless mem_save was actually used.
