# Timone

*Timone* — Italian for "helm" or "rudder". A Claude Code plugin that adds an orchestrator agent for plan-then-build development work, backed by persistent memory, code-structure intelligence, and live documentation lookup.

## Requirements

- [Claude Code](https://code.claude.com/docs/en/setup)
- [Node.js](https://nodejs.org/) 18+ and npm (used to run Context7 and to install CodeGraph/Engram if missing)
- [Git](https://git-scm.com/downloads) (used to resolve the Engram plugin dependency)

## Installation

```bash
claude plugin marketplace add ggiovinazzo/timone
claude plugin install timone@timone-marketplace
claude
```

The third command matters: `claude plugin install` only registers the plugin, it does not start anything. CodeGraph and the Engram CLI (if not already on your machine) are installed by a `SessionStart` hook, which only runs once you actually start a Claude Code session — running `claude` above is what triggers it. Context7 also only starts once a session begins.

If you already had a terminal open before running `claude`, open a **new** terminal afterward before checking `engram --version` / `codegraph --version` — the install adds them to `PATH` for new shells, not the one you installed from.

To pin to a specific release:

```bash
claude plugin marketplace add ggiovinazzo/timone#v0.1.0
```

### Installing from a local clone

```bash
git clone https://github.com/ggiovinazzo/timone.git
cd timone
claude plugin marketplace add "$(pwd)"
claude plugin install timone@timone-marketplace
claude
```

As above, the `claude` command matters — it's what triggers the `SessionStart` hooks that install CodeGraph/Engram, and starts Context7. `claude plugin install` alone does not.

After pulling changes to a local clone:

```bash
claude plugin marketplace update timone-marketplace
```
then run `/reload-plugins` in any open session.

### Uninstalling

```bash
claude plugin uninstall timone@timone-marketplace
claude plugin marketplace remove timone-marketplace
```

## What's included

| Component | Purpose |
|---|---|
| `orchestrator` agent | Plans a task, then delegates implementation and verification |
| `coder` agent | Implements one delegated task at a time |
| `verifier` agent | Checks implementation against the plan and existing tests |
| `investigator` agent | Web/document research for questions outside this repo and outside library docs |
| `project-context` skill | Persistent memory workflow (Engram) |
| `code-intelligence` skill | Repository structure workflow (CodeGraph) |
| `documentation-lookup` skill | External library/API documentation (Context7) |
| `task-planning` skill | Discovery order and delegation rules |
| `verification` skill | Post-implementation checklist |

### Automatically installed dependencies

| Dependency | Installed via |
|---|---|
| Engram (memory plugin) | Plugin dependency, installed alongside Timone |
| Engram CLI | `SessionStart` hook, downloads the release binary for your OS/architecture |
| Context7 (docs) | Bundled MCP server, started automatically |
| CodeGraph | `SessionStart` hook, `npm install -g @colbymchenry/codegraph` |

None of these are required for Timone to function — each skill falls back to standard tools (Read/Grep/Glob/WebSearch) when its corresponding service isn't available.

## Usage

Invoke the `orchestrator` agent for any non-trivial task:

1. **Plan mode** — gathers relevant memory, code structure, and documentation context, then proposes a plan and waits for approval.
2. **Build mode** — delegates implementation to `coder`, verification to `verifier`, and research questions to `investigator`.

The five skills define the procedures the orchestrator follows and don't need to be invoked directly.

## Configuration

Four model settings, one per delegated role:

| Setting | Default |
|---|---|
| `orchestrator_model` | `sonnet` |
| `coder_model` | `haiku` |
| `verifier_model` | `sonnet` |
| `investigator_model` | `sonnet` |

Each accepts a model family alias (`sonnet`, `opus`, `haiku`, `fable`) or a full model id (e.g. `claude-opus-4-6`). Run `/model` with no argument to list the ids available on your account.

Set them at install time:

```bash
claude plugin install timone@timone-marketplace \
  --config orchestrator_model=sonnet \
  --config coder_model=haiku \
  --config verifier_model=sonnet \
  --config investigator_model=sonnet
```

Or afterward, run `/timone:configure-models`.

Optional: `context7_api_key` raises Context7's rate limit; leave unset to use the free tier.

## Layout

```
.claude-plugin/
  plugin.json           # manifest, userConfig, dependencies
  marketplace.json       # plugin entry + Engram marketplace entry
agents/
  orchestrator.md         # plan-mode + build-mode coordinator
  coder.md                 # implementation
  verifier.md               # verification
  investigator.md            # research
skills/
  project-context/            # memory
  code-intelligence/            # CodeGraph
  documentation-lookup/           # Context7
  task-planning/                    # discovery order + delegation
  verification/                       # post-implementation checks
commands/
  configure-models.md    # per-role model configuration
hooks/
  hooks.json              # SessionStart hooks
  ensure-codegraph.js       # installs CodeGraph if missing
  ensure-engram.js            # installs the Engram CLI if missing
.mcp.json               # Context7 MCP server
```
