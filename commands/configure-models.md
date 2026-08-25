---
description: Configure per-role model overrides for Timone (orchestrator/coder/verifier/investigator), working around the native /plugin Configure UI's known multi-field bug.
allowed-tools: AskUserQuestion, Bash, Read
---

Configure the four per-role model settings for this plugin: `orchestrator_model` (default `sonnet`), `coder_model` (default `haiku`), `verifier_model` (default `sonnet`), `investigator_model` (default `sonnet`).

Do this instead of pointing the user at `/plugin → Installed → timone → Configure` — that form currently has a known bug where Tab/Enter don't advance between fields when a plugin has more than one `userConfig` entry, which is exactly this plugin's case.

## Steps

1. Read the plugin's current values if available (check `~/.claude/settings.json` under `pluginConfigs` for this plugin's entry, and note the defaults above for anything not set yet). Show the user their current/default value for each of the four roles before asking.
2. Ask the user, one `AskUserQuestion` call covering all four roles, whether they want to keep each default or override it. For each role, offer:
   - Keep the default (`sonnet` for orchestrator/verifier/investigator, `haiku` for coder)
   - A named alternative that makes sense for that role (e.g. `opus` for verifier if they want stricter review, `haiku` for investigator/verifier if they want maximum savings)
   - "Other" (already offered automatically) for a full pinned model id, e.g. `claude-opus-4-6` — remind them in the question text that aliases like `sonnet`/`opus` resolve to whichever version Anthropic currently recommends and can change across releases, so pin a full id if they want a specific version. They can check exactly what's available to their account with `/model` (no argument) in a separate session.
3. Once you have all four values, confirm the installed plugin's marketplace-qualified name — it's `timone@timone-marketplace` unless the user installed it from a differently-named marketplace (check `claude plugin list --json` if unsure) — and run:
   ```
   claude plugin install timone@timone-marketplace \
     --config orchestrator_model=<value> \
     --config coder_model=<value> \
     --config verifier_model=<value> \
     --config investigator_model=<value>
   ```
   Show the exact command to the user before running it, since it changes plugin configuration (a settings write) — this follows the "explicit permission for standing config changes" rule, not just a read-only lookup.
4. After it runs, confirm by reporting the values that took effect. If the command errors because the plugin is already installed and reinstall isn't supported in this Claude Code version, fall back to telling the user the exact `pluginConfigs` entry to add to `~/.claude/settings.json` by hand (non-sensitive values only — `context7_api_key` stays out of scope for this command since it's sensitive and goes through the keychain, not `pluginConfigs`).

Do not silently apply changes without showing the resulting command/values first — this is a persistent configuration change, not a read-only action.
