/**
 * architecture-validation.ts
 *
 * Validates architectural constraints.
 * Run via: npx ts-node validation/architecture-validation.ts
 * Also runs in CI — see .github/workflows/validate.yml
 *
 * Current checks: spec completeness and heuristic import analysis.
 * For full dependency graph analysis, integrate dependency-cruiser:
 *   npm install -D dependency-cruiser
 *   npx depcruise --config .dependency-cruiser.js src/
 *
 * Exit code 0 = all checks passed or skipped
 * Exit code 1 = one or more checks failed
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

type Result = { check: string; status: "PASS" | "FAIL" | "SKIP"; detail?: string };
const results: Result[] = [];

function pass(check: string, detail?: string) { results.push({ check, status: "PASS", detail }); }
function fail(check: string, detail: string) { results.push({ check, status: "FAIL", detail }); }
function skip(check: string, detail: string) { results.push({ check, status: "SKIP", detail }); }

function readFile(rel: string): string | null {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
}

function walkSrc(dir: string, extensions: string[], callback: (file: string, content: string) => void) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !["node_modules", ".git", "dist", "build", ".next"].includes(entry.name)) {
      walkSrc(full, extensions, callback);
    } else if (entry.isFile() && extensions.some((e) => entry.name.endsWith(e))) {
      callback(full, fs.readFileSync(full, "utf-8"));
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1: specs/architecture.md is populated beyond template placeholders
// ─────────────────────────────────────────────────────────────────────────────
function checkArchitectureSpecPopulated() {
  const CHECK = "specs/architecture.md is populated";
  const content = readFile("specs/architecture.md");
  if (!content) {
    fail(CHECK, "specs/architecture.md not found");
    return;
  }
  const hasModuleMap = content.includes("## Module Map") &&
    !content.match(/## Module Map\s*\n+\[Module name\]/);
  const hasForbiddenImports = content.includes("## Forbidden Imports") &&
    !content.match(/## Forbidden Imports\s*\n+\[Module A\]/);

  if (hasModuleMap && hasForbiddenImports) {
    pass(CHECK, "Module map and forbidden imports are defined");
  } else {
    skip(CHECK, "Architecture spec still contains template placeholders — populate when tech stack is chosen");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: Heuristic layering check — API layer must not import from repository
// ─────────────────────────────────────────────────────────────────────────────
function checkLayeringHeuristic() {
  const CHECK = "API layer does not import directly from repository layer";

  const layerPaths: Record<string, string[]> = {
    api: ["src/api", "src/routes", "src/controllers", "app/api", "app/routes"],
    repository: ["src/repository", "src/repositories", "src/db", "app/repository"],
  };

  const apiDirs = layerPaths.api.map((d) => path.join(ROOT, d)).filter(fs.existsSync);
  const repoDirs = layerPaths.repository.map((d) => path.join(ROOT, d)).filter(fs.existsSync);

  if (apiDirs.length === 0 || repoDirs.length === 0) {
    skip(CHECK, "API or repository layer directories not found yet — runs when project has code");
    return;
  }

  const repoBasenames = repoDirs.map((d) => path.basename(d));
  const violations: string[] = [];

  for (const apiDir of apiDirs) {
    walkSrc(apiDir, [".ts", ".js"], (file, content) => {
      for (const repoBase of repoBasenames) {
        // Look for direct imports from the repository layer
        if (new RegExp(`from ['"][^'"]*${repoBase}[^'"]*['"]`).test(content)) {
          violations.push(path.relative(ROOT, file));
        }
      }
    });
  }

  if (violations.length === 0) {
    pass(CHECK);
  } else {
    fail(CHECK, `API layer importing from repository layer:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: No circular self-imports (a file importing itself)
// ─────────────────────────────────────────────────────────────────────────────
function checkNoSelfImports() {
  const CHECK = "No self-imports";

  const srcCandidates = ["src", "app", "backend", "server"].map((d) => path.join(ROOT, d));
  const violations: string[] = [];

  for (const dir of srcCandidates) {
    walkSrc(dir, [".ts", ".tsx", ".js", ".jsx"], (file, content) => {
      const basename = path.basename(file, path.extname(file));
      const selfPattern = new RegExp(`from ['"].*[/\\\\]${basename}['"]`);
      if (selfPattern.test(content)) {
        violations.push(path.relative(ROOT, file));
      }
    });
  }

  if (violations.length === 0) {
    pass(CHECK, "No source directories found yet — will run when project has code");
  } else {
    fail(CHECK, `Files importing themselves:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: ARCHITECTURE-STATE.md is not in BOOTSTRAP phase once code exists
// ─────────────────────────────────────────────────────────────────────────────
function checkArchitectureStateIsCurrentPhase() {
  const CHECK = "ARCHITECTURE-STATE.md reflects current phase";
  const archState = readFile("sessions/ARCHITECTURE-STATE.md");
  if (!archState) {
    fail(CHECK, "sessions/ARCHITECTURE-STATE.md not found");
    return;
  }

  const isBootstrap = archState.includes("BOOTSTRAP");
  const srcExists = ["src", "app", "backend", "server"].some((d) =>
    fs.existsSync(path.join(ROOT, d))
  );

  if (isBootstrap && srcExists) {
    fail(
      CHECK,
      "ARCHITECTURE-STATE.md still says BOOTSTRAP but source directories exist — update the phase"
    );
  } else {
    pass(CHECK);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────
checkArchitectureSpecPopulated();
checkLayeringHeuristic();
checkNoSelfImports();
checkArchitectureStateIsCurrentPhase();

console.log("\n=== Architecture Validation Report ===\n");

let failed = 0;
for (const r of results) {
  const icon = r.status === "PASS" ? "✓" : r.status === "SKIP" ? "–" : "✗";
  console.log(`${icon} [${r.status}] ${r.check}`);
  if (r.detail) {
    console.log(`       ${r.detail.replace(/\n/g, "\n       ")}`);
  }
  if (r.status === "FAIL") failed++;
}

console.log(`\n${results.length} checks — ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
