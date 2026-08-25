---
name: documentation-lookup
description: Use Context7 to retrieve authoritative documentation for external libraries, frameworks, SDKs, APIs, and version specific behavior.
---

# Documentation Lookup

Context7 is the preferred source for authoritative external technical documentation.

## When required

Use Context7 when the task involves:

    - external libraries
    - frameworks
    - SDKs
    - APIs
    - configuration syntax
    - version specific behavior
    - unfamiliar framework features
    - deprecated APIs
    - integration behavior

Do not rely on model memory when authoritative documentation is available and implementation correctness depends on it.

## Workflow

1. Identify the exact library, framework, SDK, or API.
2. Resolve the appropriate Context7 documentation source.
3. Query only documentation relevant to the current task.
4. Verify API names, parameters, configuration, lifecycle, and version behavior when applicable.
5. Use the findings when planning or delegating implementation.

## Version awareness

When the project uses a specific dependency version, prefer matching documentation and check whether the documented API differs between versions.

Do not silently apply APIs from newer versions.

## Delegation

Pass relevant findings to the executor, including:

    - the API or feature used
    - constraints
    - version details
    - required configuration
    - incompatibilities

## Rules

    - Do not use Context7 for purely local code questions.
    - Do not fabricate documentation results.
    - Never claim Context7 was used unless it was actually invoked.
