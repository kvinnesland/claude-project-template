/**
 * traceability-validation.ts
 *
 * Validates that the repository satisfies traceability requirements.
 * Run via: npx ts-node validation/traceability-validation.ts
 * Also runs in CI — see .github/workflows/validate.yml
 *
 * Exit code 0 = all checks passed
 * Exit code 1 = one or more checks failed
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CR_DIR = path.join(ROOT, "change-requests");

type Result = { check: string; status: "PASS" | "FAIL" | "SKIP"; detail?: string };

const results: Result[] = [];

function pass(check: string, detail?: string) {
  results.push({ check, status: "PASS", detail });
}

function fail(check: string, detail: string) {
  results.push({ check, status: "FAIL", detail });
}

function skip(check: string, detail: string) {
  results.push({ check, status: "SKIP", detail });
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1: Recent commits reference a CR or are explicitly exempt
// ─────────────────────────────────────────────────────────────────────────────
function checkCommitMessages() {
  const CHECK = "Commit messages reference CR";
  try {
    // Check the last 20 commits, or all commits if fewer
    const log = execSync("git log --format=%s -n 20 2>/dev/null", {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();

    if (!log) {
      skip(CHECK, "No commits found");
      return;
    }

    const lines = log.split("\n").filter(Boolean);
    const crPattern = /CR-\d+/;
    // Exempt: infra/docs/chore commits (prefix or suffix), merges, reverts
    const exemptPattern = /^(Merge|Revert|Initial|INFRA:|DOCS:|CHORE:)|\((INFRA|DOCS|CHORE)\)$/i;

    const violations = lines.filter(
      (msg) => !crPattern.test(msg) && !exemptPattern.test(msg)
    );

    if (violations.length === 0) {
      pass(CHECK, `${lines.length} commits checked`);
    } else {
      fail(
        CHECK,
        `${violations.length} commit(s) missing CR reference:\n  - ${violations.join("\n  - ")}`
      );
    }
  } catch {
    skip(CHECK, "Could not read git log");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: All CRs have a status field
// ─────────────────────────────────────────────────────────────────────────────
function checkCRStructure() {
  const CHECK = "CR files have required fields";

  const crFiles = fs
    .readdirSync(CR_DIR)
    .filter((f) => f.startsWith("CR-") && f.endsWith(".md"));

  if (crFiles.length === 0) {
    skip(CHECK, "No CR files found yet");
    return;
  }

  const requiredFields = [
    "Business Goal",
    "Problem Statement",
    "Proposed Solution",
    "Impact Analysis",
    "Acceptance Criteria",
    "Required Tests",
    "Rollback Strategy",
    "Risks",
  ];

  const violations: string[] = [];

  for (const file of crFiles) {
    const content = fs.readFileSync(path.join(CR_DIR, file), "utf-8");
    const missing = requiredFields.filter((field) => !content.includes(field));
    if (missing.length > 0) {
      violations.push(`${file} missing: ${missing.join(", ")}`);
    }
    if (!/\*\*Status:\*\*|^Status:/m.test(content)) {
      violations.push(`${file} missing status field`);
    }
  }

  if (violations.length === 0) {
    pass(CHECK, `${crFiles.length} CR file(s) validated`);
  } else {
    fail(CHECK, violations.join("\n  "));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: CURRENT-STATE.md does not contain uninitialized placeholders
// ─────────────────────────────────────────────────────────────────────────────
function checkNoPlaceholders() {
  const CHECK = "Session files have no YYYY-MM-DD placeholders";

  const sessionFiles = [
    "sessions/CURRENT-STATE.md",
    "sessions/IMPLEMENTATION-LEDGER.md",
    "sessions/OPEN-ISSUES.md",
    "sessions/DECISIONS.md",
    "sessions/ARCHITECTURE-STATE.md",
  ];

  const violations: string[] = [];

  for (const rel of sessionFiles) {
    const fullPath = path.join(ROOT, rel);
    if (!fs.existsSync(fullPath)) continue;
    const raw = fs.readFileSync(fullPath, "utf-8");
    // Strip fenced code blocks (``` ... ```) before checking — format examples are not placeholders
    const content = raw.replace(/```[\s\S]*?```/g, "");
    if (content.includes("YYYY-MM-DD")) {
      violations.push(rel);
    }
  }

  if (violations.length === 0) {
    pass(CHECK);
  } else {
    fail(CHECK, `Uninitialized placeholders found in: ${violations.join(", ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: Required session files exist
// ─────────────────────────────────────────────────────────────────────────────
function checkSessionFilesExist() {
  const CHECK = "Required session files exist";

  const required = [
    "sessions/CURRENT-STATE.md",
    "sessions/OPEN-ISSUES.md",
    "sessions/DECISIONS.md",
    "sessions/IMPLEMENTATION-LEDGER.md",
    "sessions/ARCHITECTURE-STATE.md",
  ];

  const missing = required.filter((f) => !fs.existsSync(path.join(ROOT, f)));

  if (missing.length === 0) {
    pass(CHECK);
  } else {
    fail(CHECK, `Missing: ${missing.join(", ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: No hardcoded date/unit/string patterns in frontend source
//          (heuristic — full check requires project-specific src path)
// ─────────────────────────────────────────────────────────────────────────────
function checkFrontendLocalization() {
  const CHECK = "Frontend localization heuristics";

  const srcCandidates = ["src", "app", "frontend", "client"].map((d) =>
    path.join(ROOT, d)
  );
  const srcDir = srcCandidates.find((d) => fs.existsSync(d));

  if (!srcDir) {
    skip(CHECK, "No src/app/frontend/client directory found — run when project has frontend code");
    return;
  }

  // Patterns that suggest hardcoded localization
  const patterns: { label: string; pattern: RegExp }[] = [
    { label: "Hardcoded date format string", pattern: /['"`](DD|MM|YYYY)[\/\-\.](DD|MM|YYYY)/g },
    { label: "Hardcoded unit label (kg/lb/km/mi/°C/°F)", pattern: /['"` >](kg|lb|km|mi|°C|°F|miles?|kilograms?)['"` <]/g },
  ];

  const extensions = [".tsx", ".ts", ".jsx", ".js", ".vue", ".svelte"];
  const violations: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules") {
        walk(full);
      } else if (entry.isFile() && extensions.some((e) => entry.name.endsWith(e))) {
        const content = fs.readFileSync(full, "utf-8");
        for (const { label, pattern } of patterns) {
          if (pattern.test(content)) {
            violations.push(`${path.relative(ROOT, full)}: ${label}`);
          }
          pattern.lastIndex = 0;
        }
      }
    }
  }

  walk(srcDir);

  if (violations.length === 0) {
    pass(CHECK, `No obvious localization violations found in ${path.relative(ROOT, srcDir)}/`);
  } else {
    fail(CHECK, `Possible hardcoded localization in:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks and report
// ─────────────────────────────────────────────────────────────────────────────
checkSessionFilesExist();
checkNoPlaceholders();
checkCommitMessages();
checkCRStructure();
checkFrontendLocalization();

console.log("\n=== Traceability Validation Report ===\n");

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
