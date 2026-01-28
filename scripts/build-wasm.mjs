import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const cppPath = "src/wasm/particles/particles.cpp";

const cpp = resolve(cppPath);
const outDir = resolve("src/wasm/particles");
const outJs = resolve("src/wasm/particles/particles.js");

mkdirSync(outDir, { recursive: true });

if (!existsSync(cpp)) {
  console.error(`Missing C++ source file: ${cpp}`);
  console.error(`Expected at: ${cppPath}`);
  process.exit(1);
}

const args = [
  cpp,
  "-O3",
  "-std=c++20",
  "-sMODULARIZE=1",
  "-sEXPORT_ES6=1",
  "-sENVIRONMENT=web",
  "-sFILESYSTEM=0",
  "-sASSERTIONS=0",
  "-sINITIAL_MEMORY=67108864", // 64mb
  "-sALLOW_MEMORY_GROWTH=0",
  "-sEXPORTED_FUNCTIONS=_init_particles,_get_positions,_step_particles",
  "-sEXPORTED_RUNTIME_METHODS=HEAPF32",
  "-o",
  outJs,
];

const isWin = process.platform === "win32";
const res = isWin
  ? spawnSync("cmd.exe", ["/d", "/s", "/c", "emcc", ...args], {
      stdio: "inherit",
    })
  : spawnSync("emcc", args, { stdio: "inherit" });

if (res.error) {
  console.error("\nFailed to run emcc from Node.");
  console.error(res.error);
  process.exit(1);
}

process.exit(res.status ?? 1);
