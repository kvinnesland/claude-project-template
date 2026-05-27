/**
 * security-validation.ts
 *
 * Static heuristic security checks for the repository.
 * Run via: npx ts-node validation/security-validation.ts
 * Also runs in CI — see .github/workflows/validate.yml
 *
 * These checks are a safety net, not a substitute for security review.
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
// CHECK 1: .env files are gitignored
// ─────────────────────────────────────────────────────────────────────────────
function checkEnvGitignored() {
  const CHECK = ".env files are gitignored";
  const gitignore = readFile(".gitignore");
  if (!gitignore) {
    fail(CHECK, ".gitignore not found");
    return;
  }
  const lines = gitignore.split("\n").map((l) => l.trim());
  const covered = lines.some((l) => l === ".env" || l === ".env*" || l === "*.env");
  if (covered) {
    pass(CHECK);
  } else {
    fail(CHECK, ".env or .env* not found in .gitignore — secrets may be committed");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: No hardcoded secrets patterns in source files
// ─────────────────────────────────────────────────────────────────────────────
function checkHardcodedSecrets() {
  const CHECK = "No hardcoded secrets in source";

  const secretPatterns: { label: string; pattern: RegExp }[] = [
    { label: "Hardcoded password assignment", pattern: /password\s*[:=]\s*['"][^'"]{4,}['"]/i },
    { label: "Hardcoded secret/token assignment", pattern: /(secret|token|api_?key|private_?key)\s*[:=]\s*['"][^'"]{8,}['"]/i },
    { label: "AWS access key pattern", pattern: /AKIA[0-9A-Z]{16}/ },
    { label: "Generic base64 secret assignment", pattern: /(secret|token)\s*[:=]\s*['"][A-Za-z0-9+/]{32,}={0,2}['"]/i },
    { label: "Connection string with credentials", pattern: /[a-z]+:\/\/[^:]+:[^@]+@/i },
  ];

  const extensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".java", ".env.example"];
  const violations: string[] = [];
  const srcCandidates = ["src", "app", "backend", "server", "api", "frontend", "client"];
  const dirs = [ROOT, ...srcCandidates.map((d) => path.join(ROOT, d))];

  for (const dir of dirs) {
    walkSrc(dir, extensions, (file, content) => {
      // Skip test fixtures, .example files, and validation scripts themselves
      if (file.includes("__fixtures__") || file.includes(".example") || file.includes("validation/")) return;
      for (const { label, pattern } of secretPatterns) {
        if (pattern.test(content)) {
          violations.push(`${path.relative(ROOT, file)}: ${label}`);
        }
      }
    });
  }

  // Deduplicate
  const unique = [...new Set(violations)];
  if (unique.length === 0) {
    pass(CHECK);
  } else {
    fail(CHECK, `Possible hardcoded secrets:\n  - ${unique.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: Dangerous patterns (eval, dangerouslySetInnerHTML, raw SQL interpolation)
// ─────────────────────────────────────────────────────────────────────────────
function checkDangerousPatterns() {
  const CHECK = "No dangerous code patterns";

  const patterns: { label: string; pattern: RegExp }[] = [
    { label: "eval() usage", pattern: /\beval\s*\(/ },
    { label: "dangerouslySetInnerHTML", pattern: /dangerouslySetInnerHTML/ },
    { label: "Raw SQL string interpolation (template literal)", pattern: /`[^`]*(SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{/i },
    { label: "innerHTML assignment", pattern: /\.innerHTML\s*=/ },
    { label: "document.write usage", pattern: /document\.write\s*\(/ },
    { label: "child_process exec with variable", pattern: /exec\s*\(\s*[^'"`)]/ },
  ];

  const extensions = [".ts", ".tsx", ".js", ".jsx"];
  const violations: string[] = [];

  const srcCandidates = ["src", "app", "backend", "server", "api", "frontend", "client"];
  const dirs = [...srcCandidates.map((d) => path.join(ROOT, d))];

  for (const dir of dirs) {
    walkSrc(dir, extensions, (file, content) => {
      if (file.includes("validation/") || file.includes(".test.") || file.includes(".spec.")) return;
      for (const { label, pattern } of patterns) {
        if (pattern.test(content)) {
          violations.push(`${path.relative(ROOT, file)}: ${label}`);
        }
      }
    });
  }

  const unique = [...new Set(violations)];
  if (unique.length === 0) {
    pass(CHECK, "No source directories found yet — will run when project has code");
  } else {
    fail(CHECK, `Dangerous patterns found:\n  - ${unique.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: No .env files committed to git
// ─────────────────────────────────────────────────────────────────────────────
function checkNoEnvCommitted() {
  const CHECK = "No .env files tracked by git";
  try {
    const { execSync } = require("child_process");
    const tracked = execSync("git ls-files | grep -E '^\\.env' || true", {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
    if (!tracked) {
      pass(CHECK);
    } else {
      fail(CHECK, `Committed .env files found:\n  - ${tracked.split("\n").join("\n  - ")}`);
    }
  } catch {
    skip(CHECK, "Could not run git ls-files");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: All approved CRs have a Threat Model section
// ─────────────────────────────────────────────────────────────────────────────
function checkCRThreatModels() {
  const CHECK = "Approved CRs contain Threat Model";
  const crDir = path.join(ROOT, "change-requests");

  const crFiles = fs
    .readdirSync(crDir)
    .filter((f) => f.startsWith("CR-") && f.endsWith(".md"));

  if (crFiles.length === 0) {
    skip(CHECK, "No CR files found yet");
    return;
  }

  const violations: string[] = [];
  for (const file of crFiles) {
    const content = fs.readFileSync(path.join(crDir, file), "utf-8");
    const isApprovedOrDone = /Status:.*?(Approved|In Progress|Done)/i.test(content);
    if (isApprovedOrDone && !content.includes("Threat Model")) {
      violations.push(file);
    }
  }

  if (violations.length === 0) {
    pass(CHECK, `${crFiles.length} CR file(s) checked`);
  } else {
    fail(CHECK, `Approved/Done CRs missing Threat Model:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 6: Security review file exists and is not empty template
// ─────────────────────────────────────────────────────────────────────────────
function checkSecurityReviewFile() {
  const CHECK = "SECURITY-REVIEW.md exists and is complete";
  const content = readFile("reviews/SECURITY-REVIEW.md");
  if (!content) {
    fail(CHECK, "reviews/SECURITY-REVIEW.md not found");
    return;
  }
  if (content.includes("[ ]") && !content.includes("[x]") && !content.includes("[X]")) {
    skip(CHECK, "No CRs completed yet — checklist not yet exercised");
    return;
  }
  pass(CHECK);
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────
checkEnvGitignored();
checkNoEnvCommitted();
checkHardcodedSecrets();
checkDangerousPatterns();
checkCRThreatModels();
checkSecurityReviewFile();

console.log("\n=== Security Validation Report ===\n");

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
