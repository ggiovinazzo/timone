---
name: verification
description: Verify implementation results and preserve important findings in Engram after significant development work.
---

# Verification

Verification is mandatory after significant implementation work.

## Verify

Check:

1. The requested behavior was implemented.
2. Existing behavior was not unintentionally broken.
3. Relevant tests pass.
4. New behavior has appropriate test coverage.
5. Configuration, API usage, and dependencies are correct.
6. Architectural impact is consistent with the plan.

## Tool usage

Use:

    - CodeGraph when structural relationships or architectural impact need verification — but only if it is actually available; if the `codegraph` CLI/MCP tool is missing, skip this check entirely rather than blocking verification on it.
    - Context7 when implementation correctness depends on external API or version specific behavior.
    - Available memory MCP tools (e.g. Engram) to compare the result with previous decisions and project constraints, when present.

## Failure handling

If verification fails:

1. Identify the actual cause.
2. Return the task to the appropriate executor with precise findings.
3. Re verify after the correction.

Do not mark work complete because the code compiles or the executor reports success.

## Persistence

After significant work, if a memory MCP is available, save durable findings (e.g. via `mem_save`):

    - completed work
    - important decisions
    - discovered behavior
    - bugs and fixes
    - tests performed
    - remaining issues

Do not store meaningless execution noise.

Never claim verification or persistence occurred unless it actually did.
