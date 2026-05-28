/**
 * gdpr-validation.ts
 *
 * Automated GDPR/privacy checks for the repository.
 * Run via: npx ts-node validation/gdpr-validation.ts
 * Also runs in CI — see .github/workflows/validate.yml
 *
 * These checks enforce structural completeness — they do not verify legal correctness.
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
// CHECK 1: RoPA exists and is not empty
// ─────────────────────────────────────────────────────────────────────────────
function checkRoPAExists() {
  const CHECK = "gdpr/RoPA.md exists";
  const content = readFile("gdpr/RoPA.md");
  if (!content) {
    fail(CHECK, "gdpr/RoPA.md not found — Article 30 GDPR requires a Record of Processing Activities");
    return;
  }
  // Check if any real entries exist (not just the template comment)
  const hasEntries = content.includes("### ") && !content.replace(/<!--[\s\S]*?-->/g, "").match(/^#+\s*$|^\s*$/m);
  if (hasEntries) {
    pass(CHECK, "RoPA contains processing activity entries");
  } else {
    skip(CHECK, "RoPA exists but contains no entries yet — add entries as processing activities are implemented");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: Processors file exists
// ─────────────────────────────────────────────────────────────────────────────
function checkProcessorsFile() {
  const CHECK = "gdpr/processors.md exists";
  const content = readFile("gdpr/processors.md");
  if (!content) {
    fail(CHECK, "gdpr/processors.md not found — third-party processors must be documented");
    return;
  }
  pass(CHECK);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: entities.md PII classification — every entity field is classified
// ─────────────────────────────────────────────────────────────────────────────
function checkEntitiesPIIClassification() {
  const CHECK = "entities.md fields have PII classification";
  const content = readFile("specs/entities.md");
  if (!content) {
    skip(CHECK, "specs/entities.md not found");
    return;
  }

  // Look for field definitions (lines starting with - fieldname:) that lack PII classification
  const fieldLines = content.split("\n").filter((l) => /^\s*-\s+\w+:/.test(l));
  if (fieldLines.length === 0) {
    skip(CHECK, "No field definitions found in entities.md yet");
    return;
  }

  const unclassified = fieldLines.filter(
    (l) => !/pii|personal.?data|sensitive|non.?pii|no.?pii|not.?pii/i.test(l)
  );

  // If the template placeholder fields are present, skip — project not yet populated
  if (content.includes("[field]: [type]")) {
    skip(CHECK, "entities.md contains template placeholders — classify PII when real entities are defined");
    return;
  }

  if (unclassified.length === 0) {
    pass(CHECK, `${fieldLines.length} field(s) classified`);
  } else {
    fail(
      CHECK,
      `${unclassified.length} field(s) missing PII classification:\n  - ${unclassified.map((l) => l.trim()).join("\n  - ")}\n  Add 'PII | Sensitive PII | Non-PII' to each field definition.`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: entities.md retention periods documented for PII entities
// ─────────────────────────────────────────────────────────────────────────────
function checkRetentionPeriods() {
  const CHECK = "PII entities have retention periods";
  const content = readFile("specs/entities.md");
  if (!content || content.includes("[field]: [type]")) {
    skip(CHECK, "entities.md not populated yet");
    return;
  }

  // Find entity blocks that contain PII fields but no retention period
  const entityBlocks = content.split(/^## Entity:/m).slice(1);
  if (entityBlocks.length === 0) {
    skip(CHECK, "No entities defined yet");
    return;
  }

  const missing: string[] = [];
  for (const block of entityBlocks) {
    const nameMatch = block.match(/^[^\n]*/);
    const name = nameMatch ? nameMatch[0].trim() : "Unknown";
    const hasPII = /\bpii\b/i.test(block);
    const hasRetention = /retention/i.test(block);
    if (hasPII && !hasRetention) {
      missing.push(name);
    }
  }

  if (missing.length === 0) {
    pass(CHECK);
  } else {
    fail(CHECK, `Entities with PII but no retention period:\n  - ${missing.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: Approved CRs touching personal data have GDPR Impact section
// ─────────────────────────────────────────────────────────────────────────────
function checkCRGDPRSection() {
  const CHECK = "CRs with personal data have GDPR Impact section";
  const crDir = path.join(ROOT, "change-requests");

  const crFiles = fs
    .readdirSync(crDir)
    .filter((f) => f.startsWith("CR-") && f.endsWith(".md"));

  if (crFiles.length === 0) {
    skip(CHECK, "No CR files yet");
    return;
  }

  const personalDataKeywords = /email|phone|name|address|ip.?address|user.?id|profile|password|token|personal.?data|pii/i;
  const violations: string[] = [];

  for (const file of crFiles) {
    const content = fs.readFileSync(path.join(crDir, file), "utf-8");
    const isActive = /Status:.*?(Approved|In Progress|Done)/i.test(content);
    const mentionsPersonalData = personalDataKeywords.test(content);
    const hasGDPRSection = /GDPR Impact|gdpr/i.test(content);

    if (isActive && mentionsPersonalData && !hasGDPRSection) {
      violations.push(file);
    }
  }

  if (violations.length === 0) {
    pass(CHECK, `${crFiles.length} CR file(s) checked`);
  } else {
    fail(CHECK, `CRs referencing personal data without GDPR Impact section:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 6: No PII field names in plain-text log statements
// ─────────────────────────────────────────────────────────────────────────────
function checkPIIInLogs() {
  const CHECK = "No PII field names in log statements";

  const piiFieldNames = [
    "email", "password", "phone", "phoneNumber", "address",
    "firstName", "lastName", "fullName", "dateOfBirth", "dob",
    "ssn", "nationalId", "passportNumber", "creditCard",
    "cardNumber", "cvv", "iban", "accessToken", "refreshToken",
    "sessionToken", "apiKey", "privateKey",
  ];

  // Match log statements containing PII field names as keys
  const logPattern = new RegExp(
    `(console\\.log|logger\\.(info|warn|error|debug)|log\\.info|log\\.error).*?(${piiFieldNames.join("|")})`,
    "i"
  );

  const extensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".go"];
  const violations: string[] = [];
  const srcCandidates = ["src", "app", "backend", "server", "api"].map((d) => path.join(ROOT, d));

  for (const dir of srcCandidates) {
    walkSrc(dir, extensions, (file, content) => {
      if (file.includes(".test.") || file.includes(".spec.") || file.includes("validation/")) return;
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        if (logPattern.test(line)) {
          violations.push(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim().substring(0, 100)}`);
        }
      });
    });
  }

  if (violations.length === 0) {
    pass(CHECK, "No source directories found yet — will run when project has code");
  } else {
    fail(CHECK, `Possible PII in log statements:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 7: No PII field names in URL query parameters
// ─────────────────────────────────────────────────────────────────────────────
function checkPIIInURLs() {
  const CHECK = "No PII in URL query parameters";

  // Match URL construction patterns with PII field names as query params
  const piiParams = ["email", "password", "token", "ssn", "phone", "name", "dob"];
  const urlParamPattern = new RegExp(`[?&](${piiParams.join("|")})=`, "i");

  const extensions = [".ts", ".tsx", ".js", ".jsx"];
  const violations: string[] = [];
  const srcCandidates = ["src", "app", "backend", "server", "api", "frontend", "client"].map((d) =>
    path.join(ROOT, d)
  );

  for (const dir of srcCandidates) {
    walkSrc(dir, extensions, (file, content) => {
      if (file.includes(".test.") || file.includes(".spec.")) return;
      if (urlParamPattern.test(content)) {
        violations.push(path.relative(ROOT, file));
      }
    });
  }

  if (violations.length === 0) {
    pass(CHECK, "No source directories found yet — will run when project has code");
  } else {
    fail(CHECK, `Possible PII exposed in URL query parameters:\n  - ${violations.join("\n  - ")}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Read GDPR Applicable flag from sessions/CURRENT-STATE.md
// ─────────────────────────────────────────────────────────────────────────────
function isGDPRApplicable(): boolean {
  const state = readFile("sessions/CURRENT-STATE.md");
  if (!state) return true; // default to applicable if file missing
  const match = state.match(/^##\s*GDPR Applicable\s*\n([^\n]+)/m);
  if (!match) return true;
  return !match[1].trim().startsWith("false");
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────
if (!isGDPRApplicable()) {
  console.log("\n=== GDPR Validation Report ===\n");
  console.log("– [SKIP] GDPR Applicable is set to false in sessions/CURRENT-STATE.md — all checks skipped");
  console.log("\n7 checks — 0 failed\n");
  process.exit(0);
}

checkRoPAExists();
checkProcessorsFile();
checkEntitiesPIIClassification();
checkRetentionPeriods();
checkCRGDPRSection();
checkPIIInLogs();
checkPIIInURLs();

console.log("\n=== GDPR Validation Report ===\n");

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
