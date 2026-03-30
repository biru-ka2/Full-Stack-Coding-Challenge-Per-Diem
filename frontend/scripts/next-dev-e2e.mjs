/**
 * Starts `next dev` with Node >=20.9.
 * Prefers the current Node when it meets Next’s requirement, otherwise falls back to the
 * devDependency `node` package binary in node_modules.
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

function systemNodeMeetsNext() {
  const m = /^v(\d+)\.(\d+)/.exec(process.version);
  if (!m) return false;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  if (major > 20) return true;
  if (major < 20) return false;
  return minor >= 9;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binDir = path.join(root, "node_modules", "node", "bin");
const winNode = path.join(binDir, "node.exe");
const unixNode = path.join(binDir, "node");
const bundledNode = existsSync(winNode) ? winNode : unixNode;
const bundledOk = existsSync(bundledNode);

const nodeExec = systemNodeMeetsNext()
  ? process.execPath
  : bundledOk
    ? bundledNode
    : process.execPath;

const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");

const child = spawn(nodeExec, [nextCli, "dev", "--hostname", "127.0.0.1", "--port", "3000"], {
  stdio: "inherit",
  env: { ...process.env },
  cwd: root,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

