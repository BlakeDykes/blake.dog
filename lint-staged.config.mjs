import path from "node:path";

// Repo is NOT a pnpm workspace: frontend/ and backend/ install independently
// and each owns its prettier + .prettierrc. lint-staged hands task functions
// absolute paths; we rebase them onto each package and run that package's own
// prettier via `pnpm --dir`, so the correct config is picked up for each file.
const ROOT = process.cwd();

const formatIn = (pkg) => (files) => {
  const base = path.join(ROOT, pkg);
  const rel = files
    .map((file) => path.relative(base, file).split(path.sep).join("/"))
    .map((file) => JSON.stringify(file))
    .join(" ");
  return `pnpm --dir ${pkg} exec prettier --write --ignore-unknown ${rel}`;
};

export default {
  "frontend/**/*.{ts,tsx,js,jsx,mjs,cjs,json,css,scss,html,md,yml,yaml}":
    formatIn("frontend"),
  "backend/**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,yml,yaml}": formatIn("backend"),
};
