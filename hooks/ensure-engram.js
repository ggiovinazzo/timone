#!/usr/bin/env node
// Cross-platform SessionStart check: install the `engram` CLI binary if it
// isn't on PATH. The Engram Claude Code plugin (our declared dependency)
// only wires up MCP config + hooks that assume `engram` already exists on
// PATH — it does not install the binary itself. This closes that gap the
// same way ensure-codegraph.js does for the CodeGraph CLI.
"use strict";

const { spawnSync } = require("child_process");
const https = require("https");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = "Gentleman-Programming/engram";

function isEngramAvailable() {
  const result = spawnSync("engram", ["--version"], {
    stdio: "ignore",
    shell: true,
  });
  return result.status === 0;
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { "User-Agent": "timone-plugin-ensure-engram" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(httpGetJson(res.headers.location));
          return;
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    ).on("error", reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { "User-Agent": "timone-plugin-ensure-engram" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(downloadFile(res.headers.location, destPath));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`download failed: HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      }
    ).on("error", reject);
  });
}

function platformArch() {
  const platformMap = { linux: "linux", darwin: "darwin", win32: "windows" };
  const archMap = { x64: "amd64", arm64: "arm64" };
  const plat = platformMap[process.platform];
  const arch = archMap[process.arch];
  if (!plat || !arch) return null;
  return { plat, arch };
}

async function main() {
  if (isEngramAvailable()) {
    process.exit(0);
  }

  const pa = platformArch();
  if (!pa) {
    // Unsupported platform/arch combo — skip silently, same as "unavailable".
    process.exit(0);
  }

  const release = await httpGetJson(
    `https://api.github.com/repos/${REPO}/releases/latest`
  );
  const ext = pa.plat === "windows" ? "zip" : "tar.gz";
  const asset = (release.assets || []).find((a) =>
    a.name.endsWith(`_${pa.plat}_${pa.arch}.${ext}`)
  );
  if (!asset) {
    process.exit(0); // no matching release asset — skip, don't block session start
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "engram-install-"));
  const archivePath = path.join(tmpDir, asset.name);
  await downloadFile(asset.browser_download_url, archivePath);

  const binDir =
    pa.plat === "windows"
      ? path.join(os.homedir(), "bin")
      : path.join(os.homedir(), ".local", "bin");
  fs.mkdirSync(binDir, { recursive: true });

  if (ext === "zip") {
    spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Expand-Archive -Path '${archivePath}' -DestinationPath '${tmpDir}' -Force`,
      ],
      { stdio: "ignore" }
    );
    const src = path.join(tmpDir, "engram.exe");
    fs.copyFileSync(src, path.join(binDir, "engram.exe"));
    // Ensure binDir is on the user's PATH for future sessions.
    spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `if (($env:Path -split ';') -notcontains '${binDir}') { ` +
          `[Environment]::SetEnvironmentVariable('Path', '${binDir};' + [Environment]::GetEnvironmentVariable('Path','User'), 'User') }`,
      ],
      { stdio: "ignore" }
    );
  } else {
    spawnSync("tar", ["-xzf", archivePath, "-C", tmpDir], { stdio: "ignore" });
    const src = path.join(tmpDir, "engram");
    const dest = path.join(binDir, "engram");
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0o755);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

main()
  .catch(() => {
    // Never block session start on install failure — memory features just
    // won't work until the user installs the CLI manually; nothing else breaks.
  })
  .finally(() => process.exit(0));
