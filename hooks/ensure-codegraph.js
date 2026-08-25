#!/usr/bin/env node
// Cross-platform SessionStart check: install the CodeGraph CLI if it isn't on PATH.
// Uses exec-form invocation (no shell string) so this works identically on
// Windows (PowerShell/cmd, no Git Bash required) and on macOS/Linux.
"use strict";

const { spawnSync } = require("child_process");

function isCodegraphAvailable() {
  const result = spawnSync("codegraph", ["--version"], {
    stdio: "ignore",
    shell: true,
  });
  return result.status === 0;
}

try {
  if (!isCodegraphAvailable()) {
    spawnSync("npm", ["install", "-g", "@colbymchenry/codegraph"], {
      stdio: "ignore",
      shell: true,
    });
  }
} catch {
  // Never block session start on install failure — code-intelligence skill
  // and the orchestrator already skip CodeGraph cleanly when it's unavailable.
}

process.exit(0);
