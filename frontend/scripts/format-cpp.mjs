import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { spawnSync } from "node:child_process";

const root = "src/wasm";
const extensions = new Set([".c", ".cc", ".cpp", ".cxx", ".h", ".hpp"]);

function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (extensions.has(extname(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = collectFiles(root);

if (files.length === 0) {
  console.log("No C/C++ files found.");
  process.exit(0);
}

const result = spawnSync("clang-format", ["-i", ...files], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
